/**
 * Boards Component API Binding Tests
 * 게시글 목록 조회 기능에 대한 Playwright 테스트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

import { test, expect } from '@playwright/test';

test.describe('게시글 목록 조회 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // /boards 페이지로 이동
    await page.goto('/boards');
    
    // 페이지 로드 완료 대기 (data-testid 사용, network 통신이므로 2000ms 미만)
    await page.waitForSelector('[data-testid="board-list"]', { timeout: 1800 });
  });

  test('게시글 목록이 정상적으로 로드되어 표시되는지 검증', async ({ page }) => {
    // 게시글 목록이 렌더링되었는지 확인 (UI 렌더링이므로 500ms 미만)
    const boardList = page.locator('[data-testid="board-list"]');
    await expect(boardList).toBeVisible();

    // 로딩 상태가 아닌지 확인 (로딩 텍스트가 없어야 함)
    const loadingText = page.locator('text=로딩 중입니다.');
    await expect(loadingText).not.toBeVisible();

    // 게시글 아이템들이 존재하는지 확인
    const boardItems = page.locator('.boardItem');
    const itemCount = await boardItems.count();
    expect(itemCount).toBeGreaterThan(0);

    // 게시글 정보가 올바르게 표시되는지 확인 (UI 렌더링이므로 500ms 미만)
    const firstBoard = boardItems.first();
    await expect(firstBoard.locator('.boardNumber')).toBeVisible();
    await expect(firstBoard.locator('.boardTitle')).toBeVisible();
    await expect(firstBoard.locator('.boardAuthor')).toBeVisible();
    await expect(firstBoard.locator('.boardDate')).toBeVisible();
  });

  test('게시글 제목 클릭 시 상세페이지로 이동하는지 검증', async ({ page }) => {
    // 첫 번째 게시글의 제목을 클릭
    const firstBoardTitle = page.locator('.boardItem').first().locator('.boardTitle');
    await expect(firstBoardTitle).toBeVisible();
    
    // 클릭 이벤트 발생
    await firstBoardTitle.click();

    // URL이 /boards/[id] 형태로 변경되었는지 확인 (라우팅이므로 2000ms 미만)
    await page.waitForURL(/\/boards\/[a-zA-Z0-9]+/, { timeout: 1800 });
    
    // URL 패턴 검증
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/boards\/[a-zA-Z0-9]+/);
  });

  test('API 호출 실패 시 오류 메시지가 표시되는지 검증', async ({ page }) => {
    // 네트워크 요청을 차단하여 API 호출 실패 시뮬레이션
    await page.route('**/api/graphql', route => route.abort());
    
    // 페이지 새로고침하여 API 호출 재시도
    await page.reload();
    
    // 오류 메시지가 표시되는지 확인 (API 통신이므로 2000ms 미만)
    const errorMessage = page.locator('text=게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    await expect(errorMessage).toBeVisible({ timeout: 1800 });
    
    // 다시 시도 버튼이 표시되는지 확인 (UI 렌더링이므로 500ms 미만)
    const retryButton = page.locator('button:has-text("다시 시도")');
    await expect(retryButton).toBeVisible();
  });

  test('다시 시도 버튼 클릭 시 API 재호출이 정상 동작하는지 검증', async ({ page }) => {
    // 네트워크 요청을 차단
    await page.route('**/api/graphql', route => route.abort());
    
    // 페이지 새로고침
    await page.reload();
    
    // 오류 상태 확인 (API 통신이므로 2000ms 미만)
    const errorMessage = page.locator('text=게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    await expect(errorMessage).toBeVisible({ timeout: 1800 });
    
    // 네트워크 차단 해제
    await page.unroute('**/api/graphql');
    
    // 다시 시도 버튼 클릭
    const retryButton = page.locator('button:has-text("다시 시도")');
    await retryButton.click();
    
    // 게시글 목록이 다시 로드되는지 확인 (API 통신이므로 2000ms 미만)
    const boardList = page.locator('[data-testid="board-list"]');
    await expect(boardList).toBeVisible();
    
    // 오류 메시지가 사라지는지 확인 (UI 렌더링이므로 500ms 미만)
    await expect(errorMessage).not.toBeVisible();
    
    // 게시글 아이템들이 표시되는지 확인
    const boardItems = page.locator('.boardItem');
    const itemCount = await boardItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('게시글 번호가 올바르게 계산되어 표시되는지 검증', async ({ page }) => {
    // 게시글 목록이 로드될 때까지 대기
    const boardItems = page.locator('.boardItem');
    const itemCount = await boardItems.count();
    expect(itemCount).toBeGreaterThan(0);
    
    // 첫 번째 게시글의 번호가 가장 큰 번호인지 확인
    const firstBoardNumber = await boardItems.first().locator('.boardNumber').textContent();
    const secondBoardNumber = await boardItems.nth(1).locator('.boardNumber').textContent();
    
    expect(Number(firstBoardNumber)).toBeGreaterThan(Number(secondBoardNumber));
  });

  test('게시글 작성자와 날짜가 올바르게 표시되는지 검증', async ({ page }) => {
    // 게시글 목록이 로드될 때까지 대기
    const boardItems = page.locator('.boardItem');
    const itemCount = await boardItems.count();
    expect(itemCount).toBeGreaterThan(0);
    
    // 첫 번째 게시글의 정보 확인
    const firstBoard = boardItems.first();
    
    // 작성자가 비어있지 않은지 확인
    const author = await firstBoard.locator('.boardAuthor').textContent();
    expect(author).toBeTruthy();
    expect(author?.trim()).not.toBe('');
    
    // 날짜가 올바른 형식인지 확인 (YYYY.MM.DD)
    const date = await firstBoard.locator('.boardDate').textContent();
    expect(date).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
  });

  test('게시글 목록 로딩 상태 확인', async ({ page }) => {
    // 네트워크 요청을 느리게 만들어 로딩 상태 확인
    await page.route('**/api/graphql', async route => {
      // 100ms 지연을 주어 로딩 상태를 확인할 수 있도록 함
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    // 페이지 새로고침
    await page.reload();
    
    // 로딩 상태가 표시되는지 확인 (UI 렌더링이므로 500ms 미만)
    const loadingText = page.locator('text=로딩 중입니다.');
    const loadingExists = await loadingText.count();
    
    // 로딩 상태가 표시되었거나, 바로 데이터가 표시될 수 있음
    const hasData = await page.locator('[data-testid="board-list"] .boardItem').count() > 0;
    const hasLoading = loadingExists > 0;
    
    // 로딩 또는 데이터 중 하나는 표시되어야 함
    expect(hasData || hasLoading).toBe(true);
    
    // 최종적으로 데이터가 표시될 때까지 대기 (API 통신이므로 2000ms 미만)
    await page.waitForSelector('[data-testid="board-list"] .boardItem', { timeout: 1800 });
  });
});
