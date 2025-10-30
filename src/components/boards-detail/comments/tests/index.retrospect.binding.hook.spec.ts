import { test, expect } from '@playwright/test';

test.describe('댓글 조회 바인딩 훅(useCommentList) E2E', () => {
  test('성공 시나리오: 실제 서버 댓글 표시 확인', async ({ page }) => {
    // 목록에서 임의의 게시글 상세로 이동
    await page.goto('/boards');
    await page.waitForSelector('body', { timeout: 2000 });

    const boardLink = page.locator('a[href^="/boards/"]').first();
    const linkCount = await boardLink.count();
    if (linkCount === 0) test.skip();
    await boardLink.click();

    // 상세 페이지 로드 완료 식별자 대기
    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="comments-section"]', { timeout: 2000 });

    // 댓글 로딩 → 목록 표시 대기 (network < 2000ms)
    const loading = page.locator('[data-testid="comment-loading"]');
    const hasLoading = (await loading.count()) > 0;
    if (hasLoading) {
      await loading.waitFor({ state: 'detached', timeout: 1800 }).catch(() => {});
    }

    // 빈 상태가 아니면, 첫 댓글 노출 검증
    const emptyState = page.locator('[data-testid="comment-empty"]');
    const isEmpty = (await emptyState.count()) > 0;
    if (!isEmpty) {
      const firstItem = page.locator('[data-testid="comment-item"]').first();
      await expect(firstItem).toBeVisible({ timeout: 1800 });

      const writer = firstItem.locator('[data-testid="comment-item-writer"]');
      const contents = firstItem.locator('[data-testid="comment-item-contents"]');
      await expect(writer).toBeVisible({ timeout: 1800 });
      await expect(contents).toBeVisible({ timeout: 1800 });

      const writerText = (await writer.textContent())?.trim();
      const contentsText = (await contents.textContent())?.trim();
      expect(writerText && writerText.length > 0).toBeTruthy();
      expect(contentsText && contentsText.length > 0).toBeTruthy();

      // 댓글이 1개 이상이면 빈 문구가 표시되지 않아야 함
      await expect(emptyState).toHaveCount(0, { timeout: 500 });
    }
  });

  test('실패 시나리오: fetchBoardComments 모킹 에러 처리 확인', async ({ page }) => {
    await page.route('**/api/graphql', async (route) => {
      const request = route.request();
      const body = request.postData() || '';
      if (body.includes('fetchBoardComments')) {
        // 네트워크/서버 오류 시뮬레이션
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Internal Server Error' }] }),
        });
      }
      return route.continue();
    });

    // 상세 페이지로 이동
    await page.goto('/boards');
    await page.waitForSelector('body', { timeout: 2000 });
    const boardLink = page.locator('a[href^="/boards/"]').first();
    const linkCount = await boardLink.count();
    if (linkCount === 0) test.skip();
    await boardLink.click();

    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });
    await page.waitForSelector('[data-testid="comments-section"]', { timeout: 2000 });

    // 에러 메시지 노출 확인 (<= 2000ms)
    const errorMessage = page.locator('[data-testid="comment-error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 1800 });
    await expect(errorMessage).toHaveText('댓글을 불러오는데 실패하였습니다. 다시 시도해주세요.');
  });
});


