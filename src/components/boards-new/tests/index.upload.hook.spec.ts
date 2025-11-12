import { test, expect, type Dialog, type Page, type Request, type Route } from '@playwright/test';
import { Buffer } from 'node:buffer';

const gotoUploadPage = async (page: Page) => {
  await page.goto('/boards/new');
  await page.waitForSelector('[data-testid="board-upload-page"]', { timeout: 2000 });
};

const fillBoardForm = async (page: Page, overrides: Partial<Record<'writer' | 'password' | 'title' | 'contents', string>> = {}) => {
  const timestamp = Date.now();
  const writer = overrides.writer ?? `작성자-${timestamp}`;
  const password = overrides.password ?? 'playwright1';
  const title = overrides.title ?? `제목-${timestamp}`;
  const contents = overrides.contents ?? `내용-${timestamp}`;

  await page.fill('input[placeholder="작성자를 입력해 주세요."]', writer);
  await page.fill('input[type="password"]', password);
  await page.fill('input[placeholder="제목을 입력해 주세요."]', title);
  await page.fill('textarea[placeholder="내용을 입력해 주세요."]', contents);
};

const respondUploadSuccess = async (route: Route, uploadUrl: string) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: {
        uploadFile: {
          url: uploadUrl,
        },
      },
    }),
  });
};

const respondUploadFailure = async (route: Route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      errors: [
        {
          message: 'Mock upload failure',
        },
      ],
    }),
  });
};

const makeMockImageFile = (options?: { sizeMB?: number; name?: string }) => {
  const size = Math.max(1, options?.sizeMB ?? 1) * 1024 * 1024;
  const buffer = Buffer.alloc(size, 1);
  return {
    name: options?.name ?? 'mock-image.jpg',
    mimeType: 'image/jpeg',
    buffer,
  };
};

const uploadFileThroughSlot = async (page: Page, index: number, file: Parameters<Page['setInputFiles']>[1]) => {
  await page.setInputFiles(`[data-testid="file-input-${index}"]`, file);
};

const withGraphqlRoute = async (
  page: Page,
  handler: (route: Route, request: Request) => Promise<void> | void,
) => {
  await page.route('**/api/graphql', handler);
};

const parseGraphqlRequest = (request: Request): { operationName?: string; variables?: Record<string, unknown> } | undefined => {
  const contentType = request.headers()['content-type'] ?? '';
  const rawBody = request.postData();

  if (!rawBody) return undefined;

  if (contentType.includes('multipart/form-data')) {
    const marker = 'name="operations"';
    const markerIndex = rawBody.indexOf(marker);
    if (markerIndex === -1) return undefined;

    const startToken = '\r\n\r\n';
    const startIndex = rawBody.indexOf(startToken, markerIndex);
    if (startIndex === -1) return undefined;

    const afterStart = rawBody.slice(startIndex + startToken.length);
    const endIndex = afterStart.indexOf('\r\n--');
    if (endIndex === -1) return undefined;

    const operationsJson = afterStart.slice(0, endIndex);

    try {
      return JSON.parse(operationsJson);
    } catch {
      return undefined;
    }
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return undefined;
  }
};

const expectAlert = async (page: Page, message: string, action: () => Promise<unknown>) => {
  await new Promise<void>((resolve, reject) => {
    const handleDialog = async (dialog: Dialog) => {
      try {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe(message);
        await dialog.accept();
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        page.off('dialog', handleDialog);
      }
    };

    page.on('dialog', handleDialog);
    void action().catch((error) => {
      page.off('dialog', handleDialog);
      reject(error);
    });
  });
};

test.describe('게시글 이미지 업로드 훅', () => {
  test('5MB 이하 이미지를 업로드하면 미리보기가 표시되고 업로드된 URL이 저장된다', async ({ page }) => {
    const uploadUrl = 'https://example.com/uploaded-image.jpg';
    const graphqlPattern = '**/api/graphql';

    await gotoUploadPage(page);

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'UploadFile') {
        await respondUploadSuccess(route, uploadUrl);
        return;
      }

      await route.continue();
    });

    try {
      const file = {
        name: 'small-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-content'),
      };

      await uploadFileThroughSlot(page, 0, file);

      const previewImage = page.locator('[data-testid="preview-image-0"]');
      await expect(previewImage).toBeVisible({ timeout: 1900 });
      const previewSrc = await previewImage.getAttribute('src');
      expect(previewSrc).toBeTruthy();
      expect(previewSrc?.startsWith('blob:')).toBe(true);

      const uploadedCount = Number(
        await page.locator('[data-testid="uploaded-url-count"]').innerText(),
      );
      expect(uploadedCount).toBeGreaterThan(0);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('파일 용량이 5MB를 초과하면 업로드하지 않고 경고를 표시한다', async ({ page }) => {
    await gotoUploadPage(page);

    const file = makeMockImageFile({ sizeMB: 6, name: 'large-image.jpg' });

    await expectAlert(
      page,
      '이미지 용량은 최대 5MB까지 가능합니다.',
      async () => await uploadFileThroughSlot(page, 0, file),
    );

    await expect(page.locator('[data-testid="preview-image-0"]')).toHaveCount(0);
  });

  test('업로드 실패 시 경고를 표시하고 미리보기를 렌더링하지 않는다', async ({ page }) => {
    await gotoUploadPage(page);

    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'UploadFile') {
        await respondUploadFailure(route);
        return;
      }

      await route.continue();
    });

    const file = makeMockImageFile({ sizeMB: 1, name: 'error-image.jpg' });

    try {
      await expectAlert(
        page,
        '이미지 업로드에 실패했습니다.',
        async () => await uploadFileThroughSlot(page, 0, file),
      );

      await expect(page.locator('[data-testid="preview-image-0"]')).toHaveCount(0);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('업로드된 이미지는 삭제 버튼을 통해 제거할 수 있다', async ({ page }) => {
    const uploadUrl = 'https://example.com/for-delete.jpg';
    const graphqlPattern = '**/api/graphql';

    await gotoUploadPage(page);

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'UploadFile') {
        await respondUploadSuccess(route, uploadUrl);
        return;
      }

      await route.continue();
    });

    try {
      await uploadFileThroughSlot(page, 0, makeMockImageFile({ sizeMB: 1, name: 'delete-me.jpg' }));
      await uploadFileThroughSlot(page, 1, makeMockImageFile({ sizeMB: 1, name: 'keep-me.jpg' }));

      await expect(page.locator('[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      await expect(page.locator('[data-testid="preview-image-1"]')).toBeVisible({ timeout: 1900 });

      await page.locator('[data-testid="delete-image-0"]').click();

      await expect(page.locator('[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      await expect(page.locator('[data-testid="preview-image-1"]')).toHaveCount(0);
      await expect(page.locator('[data-testid="uploaded-url-count"]')).toHaveText('1', { timeout: 500 });
      await expect(page.locator('[data-testid="upload-slot-2"]')).toContainText('클릭해서 사진 업로드');
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('이미지가 있을 때 게시글 등록 요청에 images 필드가 포함된다', async ({ page }) => {
    const uploadUrl = 'https://example.com/single-image.jpg';
    const graphqlPattern = '**/api/graphql';

    await gotoUploadPage(page);

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);

      if (body?.operationName === 'UploadFile') {
        await respondUploadSuccess(route, uploadUrl);
        return;
      }

      if (body?.operationName === 'CreateBoard') {
        const variables = body.variables as { createBoardInput?: { images?: string[] } } | undefined;
        expect(variables?.createBoardInput?.images).toEqual([uploadUrl]);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createBoard: {
                _id: 'mock-board-id',
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    try {
      await uploadFileThroughSlot(page, 0, makeMockImageFile({ sizeMB: 1, name: 'board-image.jpg' }));
      await fillBoardForm(page);

      const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
      await submitButton.click();

      await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('이미지가 없더라도 게시글 등록은 images: []로 요청된다', async ({ page }) => {
    await gotoUploadPage(page);

    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);

      if (body?.operationName === 'CreateBoard') {
        const variables = body.variables as { createBoardInput?: { images?: string[] } } | undefined;
        expect(variables?.createBoardInput?.images).toEqual([]);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createBoard: {
                _id: 'mock-empty-board',
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    await fillBoardForm(page);

    try {
      const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
      await submitButton.click();

      await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });
});


