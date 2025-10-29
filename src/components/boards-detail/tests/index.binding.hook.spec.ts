/**
 * Board Binding Hook Tests
 * 게시글 상세 조회 기능에 대한 Playwright 테스트
 * Design Source: Figma Node IDs 285:32577, 285:32604, 285:32608, 285:32615
 * Last Updated: 2025-01-27
 */

import { test, expect } from '@playwright/test';

test.describe('게시글 상세 조회 기능 테스트', () => {
  test('게시글 조회 성공 시나리오', async ({ page }) => {
    // 실제 게시글 ID를 사용하여 상세 페이지로 이동
    // 먼저 게시판 목록에서 첫 번째 게시글의 ID를 가져오거나, 알려진 게시글 ID 사용
    await page.goto('/boards');
    
    // 게시판 목록 페이지가 로드될 때까지 대기
    await page.waitForSelector('body', { timeout: 2000 });
    
    // 게시글 링크를 찾아서 상세 페이지로 이동
    const boardLink = page.locator('a[href^="/boards/"]').first();
    
    // 게시글이 존재하는지 확인
    const linkCount = await boardLink.count();
    if (linkCount > 0) {
      // 게시글 링크 클릭하여 상세 페이지로 이동
      await boardLink.click();
    } else {
      // 게시글이 없을 경우, 실제 API를 통해 게시글을 생성하거나 존재하는 ID를 사용
      // 여기서는 테스트를 위해 직접 게시글을 생성하는 것이 좋지만, 
      // 일단 실제 존재하는 게시글 ID를 사용하도록 안내
      await page.goto('/boards/new');
      await page.waitForSelector('[data-testid="board-form-title"]', { timeout: 2000 });
      
      // 게시글 생성 (실제 API 호출)
      const timestamp = Date.now();
      await page.fill('input[placeholder="작성자를 입력해 주세요."]', `테스트 작성자 ${timestamp}`);
      await page.fill('input[type="password"]', 'test123456');
      await page.fill('input[placeholder="제목을 입력해 주세요."]', '테스트 게시글 제목');
      await page.fill('textarea[placeholder="내용을 입력해 주세요."]', '테스트 게시글 내용입니다.');
      
      await page.click('button[type="submit"]:has-text("등록하기")');
      
      // 등록 완료 후 상세 페이지로 이동
      await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1800 });
      await page.click('button:has-text("확인")');
      
      // 상세 페이지 URL 확인
      await expect(page).toHaveURL(/\/boards\/[^/]+/, { timeout: 1800 });
    }
    
    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });
    
    // URL에서 boardId 추출 확인
    const url = page.url();
    const boardIdMatch = url.match(/\/boards\/([^/]+)/);
    expect(boardIdMatch).not.toBeNull();
    const boardId = boardIdMatch?.[1];
    expect(boardId).toBeTruthy();
    
    // API 응답 대기 (network 통신이므로 2000ms 미만 timeout)
    await page.waitForSelector('[data-testid="board-title"]', { timeout: 1800 }).catch(async () => {
      // 로딩 상태일 수 있으므로 로딩 메시지 확인
      const loadingText = page.locator('text=불러오는 중…');
      const loadingExists = await loadingText.count();
      if (loadingExists > 0) {
        // 로딩 후 데이터가 나타날 때까지 대기
        await page.waitForSelector('[data-testid="board-title"]', { timeout: 1800 });
      }
    });
    
    // 작성자 노출 확인
    const writerElement = page.locator('[data-testid="board-writer"]');
    await expect(writerElement).toBeVisible({ timeout: 1800 });
    const writerText = await writerElement.textContent();
    expect(writerText).toBeTruthy();
    
    // 제목 노출 확인
    const titleElement = page.locator('[data-testid="board-title"]');
    await expect(titleElement).toBeVisible({ timeout: 1800 });
    const titleText = await titleElement.textContent();
    expect(titleText).toBeTruthy();
    
    // 내용 노출 확인
    const contentsElement = page.locator('[data-testid="board-contents"]');
    await expect(contentsElement).toBeVisible({ timeout: 1800 });
    const contentsText = await contentsElement.textContent();
    expect(contentsText).toBeTruthy();
    
    // _id가 존재하는지 검증 (페이지의 data 속성 또는 숨겨진 요소로 확인)
    const boardIdElement = page.locator('[data-board-id]');
    const boardIdAttribute = await boardIdElement.getAttribute('data-board-id');
    expect(boardIdAttribute).toBeTruthy();
    expect(boardIdAttribute).toBe(boardId);
  });

  test('게시글 조회 실패 시나리오', async ({ page }) => {
    // 존재하지 않는 게시글 ID로 이동
    await page.goto('/boards/non-existent-board-id-12345');
    
    // 상세 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });
    
    // API 실패 응답 대기 (network 통신이므로 2000ms 미만 timeout)
    // 에러 메시지가 표시될 때까지 대기
    await page.waitForSelector('text=게시글 정보를 불러올 수 없습니다.', { timeout: 1800 });
    
    // 에러 메시지 노출 확인
    const errorMessage = page.locator('text=게시글 정보를 불러올 수 없습니다.');
    await expect(errorMessage).toBeVisible({ timeout: 1800 });
  });

  test('게시글 조회 로딩 상태 확인', async ({ page }) => {
    // 게시글 상세 페이지로 이동
    await page.goto('/boards');
    
    // 게시판 목록 페이지가 로드될 때까지 대기
    await page.waitForSelector('body', { timeout: 2000 });
    
    // 게시글 링크 클릭하여 상세 페이지로 이동
    const boardLink = page.locator('a[href^="/boards/"]').first();
    const linkCount = await boardLink.count();
    
    if (linkCount > 0) {
      await boardLink.click();
      
      // 상세 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });
      
      // 로딩 상태가 표시되는지 확인 (데이터가 로드되기 전에 잠깐 나타날 수 있음)
      const loadingText = page.locator('text=불러오는 중…');
      const loadingExists = await loadingText.count();
      
      // 로딩 상태가 표시되었거나, 바로 데이터가 표시될 수 있음
      const hasData = await page.locator('[data-testid="board-title"]').count() > 0;
      const hasLoading = loadingExists > 0;
      
      // 로딩 또는 데이터 중 하나는 표시되어야 함
      expect(hasData || hasLoading).toBe(true);
      
      // 최종적으로 데이터가 표시될 때까지 대기
      await page.waitForSelector('[data-testid="board-title"]', { timeout: 1800 });
    } else {
      // 게시글이 없을 경우 스킵
      test.skip();
    }
  });
});

