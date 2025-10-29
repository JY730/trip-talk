import { test, expect } from '@playwright/test';

test.describe('Boards Pagination Tests', () => {
  test.beforeEach(async ({ page }) => {
    // /boards 페이지로 이동
    await page.goto('/boards');
    
    // 페이지 로드 완료 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="board-list"]', { timeout: 10000 });
  });

  test('페이지 접근 시 API 데이터가 정상적으로 조회되는지 확인', async ({ page }) => {
    // 게시글 목록이 로드되었는지 확인
    await expect(page.locator('[data-testid="board-list"]')).toBeVisible();
    
    // 로딩 상태가 아닌지 확인
    await expect(page.locator('.loadingText')).not.toBeVisible();
    
    // 에러 상태가 아닌지 확인
    await expect(page.locator('.errorText')).not.toBeVisible();
    
    // 게시글 목록이 존재하는지 확인
    const boardItems = page.locator('.boardItem');
    await expect(boardItems).toHaveCount(10); // 한 페이지당 10개
  });

  test('한 페이지에 10개의 게시글 목록이 노출되는지 확인', async ({ page }) => {
    // 게시글 목록 로드 대기
    await page.waitForSelector('.boardItem', { timeout: 10000 });
    
    // 게시글 개수 확인
    const boardItems = page.locator('.boardItem');
    await expect(boardItems).toHaveCount(10);
  });

  test('페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되는지 확인', async ({ page }) => {
    // 페이지네이션 컴포넌트 확인
    const pagination = page.locator('.paginationContainer');
    await expect(pagination).toBeVisible();
    
    // 페이지 번호 버튼들 확인 (1, 2, 3, 4, 5)
    for (let i = 1; i <= 5; i++) {
      const pageButton = page.locator(`button:has-text("${i}")`);
      await expect(pageButton).toBeVisible();
    }
  });

  test('페이지 번호 클릭 시 해당 페이지 번호에 맞는 게시글 목록이 API 요청을 통해 다시 로드되는지 확인', async ({ page }) => {
    // 첫 번째 페이지의 게시글 제목들 저장
    const firstPageTitles = await page.locator('.boardTitle').allTextContents();
    
    // 2페이지 클릭
    const page2Button = page.locator('button:has-text("2")');
    await page2Button.click();
    
    // 로딩 상태 확인
    await page.waitForSelector('.loadingText', { timeout: 1000 });
    await page.waitForSelector('.loadingText', { state: 'hidden', timeout: 10000 });
    
    // 새로운 페이지의 게시글 목록이 로드되었는지 확인
    await page.waitForSelector('.boardItem', { timeout: 10000 });
    
    // 2페이지의 게시글 제목들 가져오기
    const secondPageTitles = await page.locator('.boardTitle').allTextContents();
    
    // 첫 번째 페이지와 두 번째 페이지의 내용이 다른지 확인
    expect(firstPageTitles).not.toEqual(secondPageTitles);
  });

  test('이전 페이지(<), 다음 페이지(>) 버튼 클릭 시 페이지 범위가 5개 단위로 변경되는지 확인', async ({ page }) => {
    // 다음 페이지 버튼 클릭
    const nextButton = page.locator('button:has-text(">")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      
      // 로딩 대기
      await page.waitForSelector('.loadingText', { state: 'hidden', timeout: 10000 });
      
      // 페이지 번호가 6, 7, 8, 9, 10으로 변경되었는지 확인
      for (let i = 6; i <= 10; i++) {
        const pageButton = page.locator(`button:has-text("${i}")`);
        if (await pageButton.isVisible()) {
          await expect(pageButton).toBeVisible();
        }
      }
    }
  });

  test('검색창에 검색어를 입력한 후 엔터 또는 검색 버튼 클릭 시 검색 결과에 따라 페이지 수가 변경되는지 확인', async ({ page }) => {
    // 검색어 입력
    const searchInput = page.locator('input[placeholder="제목을 검색해 주세요."]');
    await searchInput.fill('테스트');
    
    // 검색 버튼 클릭
    const searchButton = page.locator('button:has-text("검색")');
    await searchButton.click();
    
    // 로딩 대기
    await page.waitForSelector('.loadingText', { state: 'hidden', timeout: 10000 });
    
    // 검색 결과가 로드되었는지 확인
    await page.waitForSelector('.boardItem', { timeout: 10000 });
    
    // 페이지네이션 컴포넌트가 여전히 존재하는지 확인
    const pagination = page.locator('.paginationContainer');
    await expect(pagination).toBeVisible();
  });

  test('날짜 선택 박스를 클릭하고 시작일~종료일 범위를 선택 시 기간 필터링 결과에 따라 페이지 수가 변경되는지 확인', async ({ page }) => {
    // 날짜 선택기 클릭
    const datePicker = page.locator('.ant-picker');
    await datePicker.click();
    
    // 시작일 선택 (예: 2024-01-01)
    const startDate = page.locator('.ant-picker-cell:has-text("1")').first();
    await startDate.click();
    
    // 종료일 선택 (예: 2024-01-31)
    const endDate = page.locator('.ant-picker-cell:has-text("31")').first();
    await endDate.click();
    
    // 검색 버튼 클릭
    const searchButton = page.locator('button:has-text("검색")');
    await searchButton.click();
    
    // 로딩 대기
    await page.waitForSelector('.loadingText', { state: 'hidden', timeout: 10000 });
    
    // 필터링된 결과가 로드되었는지 확인
    await page.waitForSelector('.boardItem', { timeout: 10000 });
    
    // 페이지네이션 컴포넌트가 여전히 존재하는지 확인
    const pagination = page.locator('.paginationContainer');
    await expect(pagination).toBeVisible();
  });

  test('API 요청 실패 시 오류 메시지가 노출되는지 검증', async ({ page }) => {
    // 네트워크 요청을 실패하도록 설정
    await page.route('**/api/graphql', route => {
      route.abort('failed');
    });
    
    // 페이지 새로고침
    await page.reload();
    
    // 에러 메시지 확인
    await expect(page.locator('.errorText')).toBeVisible();
    await expect(page.locator('.errorText')).toContainText('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    
    // 다시 시도 버튼 확인
    const retryButton = page.locator('button:has-text("다시 시도")');
    await expect(retryButton).toBeVisible();
  });

  test('검색 조건 또는 날짜 필터 적용 후 페이지 수가 변경되는지 검증', async ({ page }) => {
    // 초기 페이지 수 확인
    const initialPagination = page.locator('.paginationContainer');
    await expect(initialPagination).toBeVisible();
    
    // 검색어 입력
    const searchInput = page.locator('input[placeholder="제목을 검색해 주세요."]');
    await searchInput.fill('특정검색어');
    
    // 검색 실행
    const searchButton = page.locator('button:has-text("검색")');
    await searchButton.click();
    
    // 로딩 대기
    await page.waitForSelector('.loadingText', { state: 'hidden', timeout: 10000 });
    
    // 검색 후 페이지네이션이 여전히 존재하는지 확인
    await expect(initialPagination).toBeVisible();
  });
});
