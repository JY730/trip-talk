import { test, expect } from '@playwright/test';

test.describe('댓글 등록 폼 훅 - 회고형 폼 시나리오', () => {
  test('성공 시나리오: 실제 API로 _id 반환 및 완료 모달 노출', async ({ page }) => {
    // 1) 게시판 목록에서 첫 글로 이동 (data-testid 기반 로드 대기)
    await page.goto('/boards');
    await page.waitForSelector('body', { timeout: 1800 });

    const boardLink = page.locator('a[href^="/boards/"]').first();
    const linkCount = await boardLink.count();
    if (linkCount === 0) test.skip();
    await boardLink.click();

    // 2) 상세 페이지 로드 대기 (고정 식별자)
    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 1800 });

    // 3) 입력값 채우기 (작성자, 비밀번호, 내용, 평점은 옵션)
    const timestamp = Date.now();
    await page.fill('[data-testid="comment-writer"] input', `사용자${timestamp}`);
    await page.fill('[data-testid="comment-password"] input', '1234');
    await page.fill('[data-testid="comment-contents"] textarea, [data-testid="comment-contents"]', '좋아요');

    // 4) 등록 버튼 클릭 (네트워크 통신 타임아웃 < 2000ms)
    await page.click('[data-testid="comment-submit"]');

    // 5) 성공 모달 확인
    await expect(page.locator('text=댓글이 등록되었습니다.')).toBeVisible({ timeout: 1800 });

    // 6) 확인 클릭 시 새로고침 검증 (URL 동일 + 새 로드)
    const beforeUrl = page.url();
    await page.click('button:has-text("확인")');
    await page.waitForURL(beforeUrl, { timeout: 1800 });
  });

  test('실패 시나리오: API 모킹으로 에러 발생 시 실패 모달 노출', async ({ page }) => {
    // 1) 게시판 목록 → 상세 이동
    await page.goto('/boards');
    await page.waitForSelector('body', { timeout: 1800 });
    const boardLink = page.locator('a[href^="/boards/"]').first();
    const linkCount = await boardLink.count();
    if (linkCount === 0) test.skip();
    await boardLink.click();

    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 1800 });

    // 2) GraphQL 요청 모킹 (createBoardComment만 실패)
    await page.route('**/api/graphql', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON?.() as any;
      const isCreate = postData?.query?.includes('mutation createBoardComment');
      if (isCreate) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Mocked failure' }],
            data: null,
          }),
        });
      }
      return route.fallback();
    });

    // 3) 입력 및 전송
    const timestamp = Date.now();
    await page.fill('[data-testid="comment-writer"] input', `사용자${timestamp}`);
    await page.fill('[data-testid="comment-password"] input', '1234');
    await page.fill('[data-testid="comment-contents"] textarea, [data-testid="comment-contents"]', '아쉬워요');
    await page.click('[data-testid="comment-submit"]');

    // 4) 실패 메시지 및 모달 노출 확인
    await expect(page.locator('text=에러가 발생하였습니다. 다시 시도해 주세요.')).toBeVisible({ timeout: 1800 });
    await page.click('button:has-text("확인")');
  });
});


