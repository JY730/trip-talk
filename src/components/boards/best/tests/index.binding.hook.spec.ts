import { expect, test } from '@playwright/test';

test.describe('베스트 게시글 목록 조회', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="best-board-section"]', { timeout: 1800 });
  });

  test('fetchBoardsOfTheBest API 데이터가 정상 렌더링되는지 확인', async ({ page }) => {
    const firstCard = page.locator('[data-testid="best-board-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 1800 });

    await expect(firstCard.locator('[data-testid="best-board-title"]')).toBeVisible({ timeout: 400 });
    await expect(firstCard.locator('[data-testid="best-board-writer"]')).toBeVisible({ timeout: 400 });
    await expect(firstCard.locator('[data-testid="best-board-like-count"]')).toBeVisible({ timeout: 400 });
    await expect(firstCard.locator('[data-testid="best-board-created-at"]')).toBeVisible({ timeout: 400 });

    const titleText = await firstCard.locator('[data-testid="best-board-title"]').textContent();
    expect(titleText?.trim()).not.toBe('');
  });

  test('게시글 카드 클릭 시 상세 페이지로 이동하는지 확인', async ({ page }) => {
    const firstCard = page.locator('[data-testid="best-board-card"]').first();
    await expect(firstCard).toBeVisible({ timeout: 1800 });

    await firstCard.click();

    await page.waitForURL(/\/boards\/[a-f0-9-]+/, { timeout: 1800 });
    expect(page.url()).toMatch(/\/boards\/[a-f0-9-]+/);
  });

  test('API 호출 실패 시 오류 메시지가 노출되는지 확인', async ({ page }) => {
    await page.route('**/api/graphql', (route) => route.abort());
    await page.reload();

    const errorMessage = page.locator('[data-testid="best-board-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 1800 });

    await page.unroute('**/api/graphql');
  });
});

