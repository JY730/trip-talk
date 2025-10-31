import { test, expect, type Page } from '@playwright/test';

const waitForBoardsPage = async (page: Page) => {
  await page.goto('/boards');
  await page.waitForSelector('[data-testid="board-list"]');
};

const ensureGuest = async (page: Page) => {
  await waitForBoardsPage(page);
  await page.evaluate(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  });
  await page.reload();
  await page.waitForSelector('[data-testid="board-list"]');
};

const login = async (page: Page) => {
  await page.goto('/auth/login');
  await page.getByTestId('auth-login-page').waitFor();

  await page.getByPlaceholder('이메일을 입력해 주세요.').fill('a@c.com');
  await page.getByPlaceholder('비밀번호를 입력해 주세요.').fill('1234qwer');

  const loginButton = page.getByRole('button', { name: '로그인' });
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  const confirmButton = page.getByRole('button', { name: '확인' });
  await confirmButton.waitFor();
  await confirmButton.click();

  await expect(page).toHaveURL(/\/boards$/);
  await page.waitForSelector('[data-testid="board-list"]');
};

const createBoardForDeletion = async (page: Page) => {
  const timestamp = Date.now();
  const title = `플레이wright-삭제테스트-${timestamp}`;
  const contents = `삭제 테스트 본문-${timestamp}`;
  const writer = `플레이wright-작성자-${timestamp}`;

  const response = await page.request.post('/api/graphql', {
    data: {
      query: `mutation CreateBoard($input: CreateBoardInput!) {
        createBoard(createBoardInput: $input) {
          _id
        }
      }`,
      variables: {
        input: {
          writer,
          password: 'test1234',
          title,
          contents,
        },
      },
    },
  });

  const json = await response.json();
  const boardId = json?.data?.createBoard?._id as string | undefined;

  if (!boardId) {
    throw new Error('게시글 생성 실패: boardId를 찾을 수 없습니다.');
  }

  return { boardId, title };
};

test.describe('게시글 삭제 기능', () => {
  test.describe('비로그인 사용자', () => {
    test('삭제 아이콘이 노출되지 않아야 한다', async ({ page }) => {
      await ensureGuest(page);

      const deleteIcons = page.locator('[data-testid^="board-delete-"]');
      await expect(deleteIcons).toHaveCount(0);
    });
  });

  test.describe('로그인 사용자', () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      });
      await login(page);
    });

    test('삭제 아이콘 노출 및 삭제 성공 후 목록이 갱신되어야 한다', async ({ page }) => {
      const { boardId, title } = await createBoardForDeletion(page);

      await waitForBoardsPage(page);
      await page.waitForSelector(`[data-testid="board-item-${boardId}"]`);

      const targetItem = page.locator(`[data-testid="board-item-${boardId}"]`);
      const targetTitle = page.getByTestId(`board-title-${boardId}`);
      await targetTitle.waitFor();
      await expect(targetTitle).toHaveText(title);

      await targetItem.hover();

      const deleteButton = page.getByTestId(`board-delete-${boardId}`);
      await expect(deleteButton).toBeVisible();

      await deleteButton.click();

      const confirmButton = page.getByTestId(`board-delete-confirm-${boardId}`);
      await confirmButton.waitFor();
      await confirmButton.click();

      await expect(page.locator(`[data-testid="board-item-${boardId}"]`)).toHaveCount(0);
    });

    test('삭제 실패 시 에러 모달이 노출되고 게시글이 유지되어야 한다', async ({ page }) => {
      const { boardId } = await createBoardForDeletion(page);

      await waitForBoardsPage(page);
      await page.waitForSelector(`[data-testid="board-item-${boardId}"]`);

      const targetItem = page.locator(`[data-testid="board-item-${boardId}"]`);
      await targetItem.hover();

      await page.route('**/graphql', async (route) => {
        const request = route.request();
        const body = request.postDataJSON() as { query?: string } | undefined;
        if (body?.query?.includes('mutation DeleteBoard')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: '권한이 없습니다.',
                  extensions: { code: 'UNAUTHORIZED' },
                },
              ],
              data: {
                deleteBoard: null,
              },
            }),
          });
          return;
        }

        await route.continue();
      });

      try {
        const deleteRequestPromise = page.waitForRequest((req) => {
          if (req.method() !== 'POST') return false;
          const postData = req.postData();
          return typeof postData === 'string' && postData.includes('mutation DeleteBoard');
        });

        const deleteButton = page.getByTestId(`board-delete-${boardId}`);
        await expect(deleteButton).toBeVisible();
        await deleteButton.click();

        const confirmButton = page.getByTestId(`board-delete-confirm-${boardId}`);
        await confirmButton.waitFor();
        await confirmButton.click();

        await deleteRequestPromise;

        const errorModalButton = page.getByTestId('board-delete-error-confirm');
        await page.waitForSelector('[data-testid="board-delete-error-confirm"]');
        await expect(page.locator('text=게시글 삭제 실패')).toBeVisible();
        await errorModalButton.click();

        await expect(page.locator(`[data-testid="board-item-${boardId}"]`)).toBeVisible();
      } finally {
        await page.unroute('**/graphql');
      }
    });
  });
});


