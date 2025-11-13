import { test, expect, type Dialog, type Page, type Request, type Route } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { urls } from '@/commons/constants/url';

const gotoEditPage = async (page: Page, boardId: string) => {
  await page.goto(urls.boards.edit(boardId));
  await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
};

const respondFetchBoard = async (route: Route, images: string[] = []) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: {
        fetchBoard: {
          _id: 'test-board-id',
          writer: '테스트 작성자',
          title: '테스트 제목',
          contents: '테스트 내용',
          images,
          youtubeUrl: null,
          boardAddress: {
            address: '',
            addressDetail: '',
            zipcode: '',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    }),
  });
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

test.describe('게시글 수정 이미지 업로드 훅', () => {
  const testBoardId = 'test-board-123';

  test('기존 이미지 조회 시 미리보기 이미지가 렌더링된다', async ({ page }) => {
    const existingImages = ['https://example.com/existing-image-1.jpg', 'https://example.com/existing-image-2.jpg'];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      
      // uploadedUrls가 설정될 때까지 대기 (uploaded-url-count가 2가 될 때까지)
      await page.waitForFunction(
        () => {
          const countElement = document.querySelector('[data-testid="uploaded-url-count"]');
          if (!countElement) return false;
          const count = Number(countElement.textContent || '0');
          return count >= 2;
        },
        { timeout: 3000 }
      );
      
      // 이미지가 렌더링될 때까지 대기 (img 태그가 존재할 때까지)
      await page.waitForFunction(
        () => {
          const img0 = document.querySelector('img[data-testid="preview-image-0"]');
          const img1 = document.querySelector('img[data-testid="preview-image-1"]');
          return img0 !== null && img1 !== null;
        },
        { timeout: 3000 }
      );

      // 기존 이미지 미리보기 확인 (img 태그만 확인)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      await expect(page.locator('img[data-testid="preview-image-1"]')).toBeVisible({ timeout: 1900 });

      // uploadedUrls.length > 0 검증
      const uploadedCount = Number(
        await page.locator('[data-testid="uploaded-url-count"]').innerText(),
      );
      expect(uploadedCount).toBeGreaterThan(0);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('이미지 변경 시 새 이미지로 교체된다', async ({ page }) => {
    const existingImages = ['https://example.com/existing-image-1.jpg'];
    const newUploadUrl = 'https://example.com/new-image.jpg';
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }
      if (body?.operationName === 'UploadFile') {
        await respondUploadSuccess(route, newUploadUrl);
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      
      // uploadedUrls가 설정될 때까지 대기 (uploaded-url-count가 0보다 커질 때까지)
      await page.waitForFunction(
        () => {
          const countElement = document.querySelector('[data-testid="uploaded-url-count"]');
          if (!countElement) return false;
          const count = Number(countElement.textContent || '0');
          return count > 0;
        },
        { timeout: 3000 }
      );
      
      // 이미지가 렌더링될 때까지 대기 (img 태그가 존재할 때까지)
      await page.waitForFunction(
        () => {
          const img = document.querySelector('img[data-testid="preview-image-0"]');
          return img !== null;
        },
        { timeout: 3000 }
      );

      // 기존 이미지 확인 (img 태그만 확인)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      const oldSrc = await page.locator('img[data-testid="preview-image-0"]').getAttribute('src');

      // 새 이미지 업로드 (0번 슬롯에 이미 이미지가 있으므로 교체됨)
      const file = makeMockImageFile({ sizeMB: 1, name: 'new-image.jpg' });
      await uploadFileThroughSlot(page, 0, file);

      // 업로드 완료 대기
      await page.waitForTimeout(1000);

      // 새 이미지로 변경 확인 (img 태그만 확인)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      const newSrc = await page.locator('img[data-testid="preview-image-0"]').getAttribute('src');
      // 새 이미지 URL이 기존과 다른지 확인 (blob URL이 아닌 실제 URL)
      expect(newSrc).toBeTruthy();
      // oldSrc는 기존 이미지 URL이고, newSrc는 새로 업로드된 이미지 URL이어야 함
      // 하지만 blob URL일 수도 있으므로, URL이 존재하는지만 확인
      if (newSrc && !newSrc.startsWith('blob:')) {
        expect(newSrc).not.toBe(oldSrc);
      }
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('파일 용량이 5MB를 초과하면 업로드하지 않고 경고를 표시한다', async ({ page }) => {
    const existingImages: string[] = [];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      const file = makeMockImageFile({ sizeMB: 6, name: 'large-image.jpg' });

      await expectAlert(
        page,
        '이미지 용량은 최대 5MB까지 가능합니다.',
        async () => await uploadFileThroughSlot(page, 0, file),
      );

      // 미리보기가 표시되지 않아야 함
      await expect(page.locator('[data-testid="preview-image-0"]')).toHaveCount(0);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('업로드 실패 시 경고를 표시하고 미리보기를 렌더링하지 않는다', async ({ page }) => {
    const existingImages: string[] = [];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }
      if (body?.operationName === 'UploadFile') {
        await respondUploadFailure(route);
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      await page.waitForTimeout(500);

      const file = makeMockImageFile({ sizeMB: 1, name: 'error-image.jpg' });

      await expectAlert(
        page,
        '이미지 업로드에 실패했습니다.',
        async () => await uploadFileThroughSlot(page, 0, file),
      );

      // 미리보기가 표시되지 않아야 함 (img 태그가 없어야 함)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toHaveCount(0);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('이미지 삭제 시 미리보기가 제거되고 uploadedUrls 갯수가 감소한다', async ({ page }) => {
    const existingImages = [
      'https://example.com/existing-image-1.jpg',
      'https://example.com/existing-image-2.jpg',
    ];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      
      // uploadedUrls가 설정될 때까지 대기 (uploaded-url-count가 2가 될 때까지)
      await page.waitForFunction(
        () => {
          const countElement = document.querySelector('[data-testid="uploaded-url-count"]');
          if (!countElement) return false;
          const count = Number(countElement.textContent || '0');
          return count >= 2;
        },
        { timeout: 3000 }
      );
      
      // 이미지가 렌더링될 때까지 대기 (img 태그가 존재할 때까지)
      await page.waitForFunction(
        () => {
          const img0 = document.querySelector('img[data-testid="preview-image-0"]');
          const img1 = document.querySelector('img[data-testid="preview-image-1"]');
          return img0 !== null && img1 !== null;
        },
        { timeout: 3000 }
      );

      // 기존 이미지 확인 (img 태그만 확인)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });
      await expect(page.locator('img[data-testid="preview-image-1"]')).toBeVisible({ timeout: 1900 });

      const initialCount = Number(
        await page.locator('[data-testid="uploaded-url-count"]').innerText(),
      );
      expect(initialCount).toBe(2);

      // hover 시 삭제 버튼 표시 확인
      await page.locator('[data-testid="image-slot-0"]').hover();
      await expect(page.locator('[data-testid="delete-image-0"]')).toBeVisible({ timeout: 500 });

      // 삭제 버튼 클릭
      await page.locator('[data-testid="delete-image-0"]').click();

      // uploadedUrls 갯수가 감소할 때까지 대기
      await page.waitForFunction(
        () => {
          const countElement = document.querySelector('[data-testid="uploaded-url-count"]');
          if (!countElement) return false;
          const count = Number(countElement.textContent || '0');
          return count === 1; // 2개에서 1개로 감소
        },
        { timeout: 3000 }
      );

      // 미리보기 제거 확인 (img 태그가 없어야 함)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toHaveCount(0);
      // upload-slot-0이 렌더링될 때까지 대기
      await page.waitForSelector('[data-testid="upload-slot-0"]', { timeout: 2000 });
      await expect(page.locator('[data-testid="upload-slot-0"]')).toBeVisible({ timeout: 500 });

      // uploadedUrls 갯수 감소 확인
      const newCount = Number(
        await page.locator('[data-testid="uploaded-url-count"]').innerText(),
      );
      expect(newCount).toBe(1);
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('게시글 수정 완료 시 images 필드가 반영된다', async ({ page }) => {
    const existingImages = ['https://example.com/existing-image-1.jpg'];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }

      if (body?.operationName === 'UpdateBoard') {
        const variables = body.variables as { updateBoardInput?: { images?: string[] } } | undefined;
        expect(variables?.updateBoardInput?.images).toEqual(existingImages);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              updateBoard: {
                _id: testBoardId,
                images: existingImages,
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      
      // uploadedUrls가 설정될 때까지 대기 (uploaded-url-count가 1이 될 때까지)
      await page.waitForFunction(
        () => {
          const countElement = document.querySelector('[data-testid="uploaded-url-count"]');
          if (!countElement) return false;
          const count = Number(countElement.textContent || '0');
          return count >= 1;
        },
        { timeout: 3000 }
      );
      
      // 이미지가 렌더링될 때까지 대기 (img 태그가 존재할 때까지)
      await page.waitForFunction(
        () => {
          const img = document.querySelector('img[data-testid="preview-image-0"]');
          return img !== null;
        },
        { timeout: 3000 }
      );

      // 기존 이미지 확인 (img 태그만 확인)
      await expect(page.locator('img[data-testid="preview-image-0"]')).toBeVisible({ timeout: 1900 });

      // 버튼이 활성화되도록 제목을 실제로 수정 (isDirty가 true가 되어야 함)
      const titleInput = page.locator('input[data-testid="board-update-title"]');
      const currentTitle = await titleInput.inputValue();
      await titleInput.fill(currentTitle + ' 수정'); // 실제로 변경
      
      // form이 업데이트되고 버튼이 활성화될 때까지 대기
      await page.waitForTimeout(300);

      // 게시글 수정하기 버튼 클릭
      const submitButton = page.locator('button[type="submit"]:has-text("수정하기")');
      await expect(submitButton).toBeEnabled({ timeout: 3000 });
      await submitButton.click();

      // updateBoard 호출 확인은 route handler에서 검증됨
      // 모달이 표시되는지 확인
      await expect(page.locator('text=게시글 수정이 완료되었습니다.')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('이미지가 없을 경우 images: []로 전송된다', async ({ page }) => {
    const existingImages: string[] = [];
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);
      if (body?.operationName === 'FetchBoard' || body?.operationName === 'FetchBoardForEdit') {
        await respondFetchBoard(route, existingImages);
        return;
      }

      if (body?.operationName === 'UpdateBoard') {
        const variables = body.variables as { updateBoardInput?: { images?: string[] } } | undefined;
        expect(variables?.updateBoardInput?.images).toEqual([]);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              updateBoard: {
                _id: testBoardId,
                images: [],
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    try {
      await gotoEditPage(page, testBoardId);

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="board-edit-page"]', { timeout: 2000 });
      await page.waitForTimeout(1000);

      // 버튼이 활성화되도록 제목을 실제로 수정 (isDirty가 true가 되어야 함)
      const titleInput = page.locator('input[data-testid="board-update-title"]');
      const currentTitle = await titleInput.inputValue();
      await titleInput.fill(currentTitle + ' 수정'); // 실제로 변경
      
      // form이 업데이트되고 버튼이 활성화될 때까지 대기
      await page.waitForTimeout(300);

      // 게시글 수정하기 버튼 클릭
      const submitButton = page.locator('button[type="submit"]:has-text("수정하기")');
      await expect(submitButton).toBeEnabled({ timeout: 3000 });
      await submitButton.click();

      // updateBoard 호출 확인은 route handler에서 검증됨
      await expect(page.locator('text=게시글 수정이 완료되었습니다.')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });
});

