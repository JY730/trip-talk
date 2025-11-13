import { test, expect, type Page, type Dialog, type Route, type Request } from '@playwright/test';

interface CreatedBoard {
  boardId: string;
  writer: string;
  password: string;
  title: string;
  contents: string;
}

const createBoard = async (page: Page): Promise<CreatedBoard> => {
  await page.goto('/boards/new');
  await page.waitForSelector('[data-testid="board-form-title"]', { timeout: 2000 });

  const timestamp = Date.now();
  const writer = `플레이wright-작성자-${timestamp}`;
  const password = 'test1234';
  const title = `플레이wright-제목-${timestamp}`;
  const contents = `플레이wright-내용-${timestamp}`;

  await page.fill('input[placeholder="작성자를 입력해 주세요."]', writer);
  await page.fill('input[type="password"]', password);
  await page.fill('input[placeholder="제목을 입력해 주세요."]', title);
  await page.fill('textarea[placeholder="내용을 입력해 주세요."]', contents);

  await page.click('button[type="submit"]:has-text("등록하기")');

  await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1900 });
  await expect(page.locator('text=게시글이 성공적으로 등록되었습니다.')).toBeVisible({ timeout: 1900 });

  await page.click('button:has-text("확인")');

  // 상세 페이지로 이동할 때까지 대기
  await page.waitForURL(/\/boards\/[^/]+$/, { timeout: 3000 });
  await expect(page).toHaveURL(/\/boards\/[^/]+$/, { timeout: 1900 });

  const boardUrl = page.url();
  const boardId = boardUrl.split('/').pop() ?? '';

  // 상세 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('[data-testid="board-title"]', { timeout: 5000 });

  return {
    boardId,
    writer,
    password,
    title,
    contents,
  };
};

test.describe('게시글 수정 폼 기능 테스트', () => {
  test('상세 페이지에서 수정하기 버튼 클릭 시 수정 페이지로 이동해야 함', async ({ page }) => {
    const { boardId, title } = await createBoard(page);

    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="board-title"]')).toHaveText(title);

    await page.waitForSelector('[data-testid="board-edit-button"]', { timeout: 2000 });
    await page.click('[data-testid="board-edit-button"]');

    await page.waitForSelector('[data-testid="board-update-form-title"]', { timeout: 2000 });
    await expect(page).toHaveURL(new RegExp(`/boards/${boardId}/edit$`), { timeout: 2000 });
  });

  test('수정 페이지 진입 시 기존 데이터 바인딩 및 입력 제한 확인', async ({ page }) => {
    const { boardId, title, contents, writer } = await createBoard(page);

    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="board-edit-button"]', { timeout: 2000 });
    
    await page.click('[data-testid="board-edit-button"]');
    await page.waitForSelector('[data-testid="board-update-form"]', { timeout: 2000 });

    // URL 확인 전에 페이지가 완전히 로드될 때까지 대기
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(new RegExp(`/boards/${boardId}/edit$`), { timeout: 2000 });

    await expect(page.locator('input[data-testid="board-update-title"]')).toHaveValue(title);
    await expect(page.locator('textarea[data-testid="board-update-contents"]')).toHaveValue(contents);
    await expect(page.locator('input[data-testid="board-update-writer"]')).toHaveValue(writer);

    await expect(page.locator('input[data-testid="board-update-writer"]')).toBeDisabled();
    await expect(page.locator('input[data-testid="board-update-password"]')).toBeDisabled();

    await expect(page.locator('button[data-testid="board-update-submit"]')).toBeDisabled();
  });

  test('제목과 내용을 수정하면 updateBoard 요청이 전송되고 성공 모달 노출', async ({ page }) => {
    const { boardId, password, title } = await createBoard(page);

    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="board-edit-button"]', { timeout: 2000 });
    
    await page.click('[data-testid="board-edit-button"]');
    await page.waitForSelector('[data-testid="board-update-form"]', { timeout: 2000 });

    const newTitle = `${title}-수정`; 
    const newContents = `수정된 내용-${Date.now()}`;

    await page.fill('input[data-testid="board-update-title"]', newTitle);
    await page.fill('textarea[data-testid="board-update-contents"]', newContents);

    const submitButton = page.locator('button[data-testid="board-update-submit"]');
    await expect(submitButton).toBeEnabled();

    const updateRequestPromise = page.waitForRequest((request) => {
      if (!request.url().includes('/api/graphql')) return false;
      const body = request.postData();
      return typeof body === 'string' && body.includes('UpdateBoard');
    });

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept(password);
    });

    await submitButton.click();

    const updateRequest = await updateRequestPromise;
    const requestBody = updateRequest.postDataJSON() as {
      variables: { updateBoardInput: Record<string, unknown> };
    };
    const inputKeys = Object.keys(requestBody.variables.updateBoardInput).sort();
    expect(inputKeys).toEqual(['contents', 'title']);

    await expect(page.locator('text=게시글 수정이 완료되었습니다.')).toBeVisible({ timeout: 1900 });
    await expect(page.locator('text=게시글이 성공적으로 수정되었습니다.')).toBeVisible({ timeout: 1900 });

    await page.click('button:has-text("확인")');

    // 상세 페이지로 이동할 때까지 대기
    await page.waitForURL(new RegExp(`/boards/${boardId}$`), { timeout: 3000 });
    await expect(page).toHaveURL(new RegExp(`/boards/${boardId}$`), { timeout: 1900 });
    
    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 2000 });
    await expect(page.locator('[data-testid="board-title"]')).toHaveText(newTitle);
    await expect(page.locator('[data-testid="board-contents"]')).toContainText(newContents);
  });

  test('잘못된 비밀번호 입력 시 alert 및 실패 모달이 표시되어야 함', async ({ page }) => {
    const { boardId } = await createBoard(page);

    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="board-edit-button"]', { timeout: 2000 });
    
    await page.click('[data-testid="board-edit-button"]');
    await page.waitForSelector('[data-testid="board-update-form"]', { timeout: 2000 });

    await page.fill('input[data-testid="board-update-title"]', `수정 실패 테스트-${Date.now()}`);

    const submitButton = page.locator('button[data-testid="board-update-submit"]');
    await expect(submitButton).toBeEnabled();

    const graphqlRoute = async (route: Route, request: Request) => {
      const postData = request.postDataJSON() as { operationName?: string } | undefined;
      if (postData?.operationName === 'UpdateBoard') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [
              {
                message: '비밀번호가 일치하지 않습니다.',
                extensions: { code: 'UNAUTHENTICATED' },
              },
            ],
          }),
        });
        return;
      }

      await route.continue();
    };

    await page.route('**/api/graphql', graphqlRoute);

    const dialogHandler = async (dialog: Dialog) => {
      if (dialog.type() === 'prompt') {
        await dialog.accept('wrong-password');
        return;
      }

      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('비밀번호가 일치하지 않습니다.');
      await dialog.accept();
      page.off('dialog', dialogHandler);
    };

    page.on('dialog', dialogHandler);

    await submitButton.click();

    await expect(page.locator('text=게시글 수정 실패')).toBeVisible({ timeout: 1900 });
    await expect(page.locator('text=에러가 발생하였습니다. 다시 시도해 주세요.')).toBeVisible({ timeout: 1900 });

    await page.click('button:has-text("확인")');

    await expect(page.locator('text=게시글 수정 실패')).toBeHidden({ timeout: 400 });
    await expect(page).toHaveURL(new RegExp(`/boards/${boardId}/edit$`), { timeout: 2000 });

    page.off('dialog', dialogHandler);
    await page.unroute('**/api/graphql', graphqlRoute);
  });
});


