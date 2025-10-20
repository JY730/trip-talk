/**
 * Navigation Link Routing Test
 * 
 * Playwright를 활용한 navigation 링크 routing 및 active 상태 테스트
 * 
 * 테스트 조건:
 * - data-testid를 사용하여 페이지 로드 확인
 * - timeout 500ms 미만
 * - /products, /mypage, /auth/login은 skip (페이지 미구현)
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('http://localhost:3000');
    // layout이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="layout-header"]', { timeout: 500 });
  });

  test('로고 클릭 시 /boards로 이동', async ({ page }) => {
    // 로고 클릭
    await page.click('[data-testid="logo-link"]');
    
    // /boards 페이지로 이동 확인
    await page.waitForSelector('[data-testid="boards-page"]', { timeout: 500 });
    expect(page.url()).toContain('/boards');
    
    // navigation active 상태 확인
    const navBoards = page.locator('[data-testid="nav-boards"]');
    await expect(navBoards).toHaveClass(/navLinkActive/);
  });

  test('트립토크 메뉴 클릭 시 /boards로 이동 및 active 상태 변경', async ({ page }) => {
    // 트립토크 메뉴 클릭
    await page.click('[data-testid="nav-boards"]');
    
    // /boards 페이지로 이동 확인
    await page.waitForSelector('[data-testid="boards-page"]', { timeout: 500 });
    expect(page.url()).toContain('/boards');
    
    // navigation active 상태 확인
    const navBoards = page.locator('[data-testid="nav-boards"]');
    await expect(navBoards).toHaveClass(/navLinkActive/);
  });

  test.skip('숙박권 구매 메뉴 클릭 시 /products로 이동', async ({ page }) => {
    // /products 페이지 미구현으로 skip
    await page.click('[data-testid="nav-products"]');
    expect(page.url()).toContain('/products');
  });

  test.skip('마이페이지 메뉴 클릭 시 /mypage로 이동', async ({ page }) => {
    // /mypage 페이지 미구현으로 skip
    await page.click('[data-testid="nav-mypage"]');
    expect(page.url()).toContain('/mypage');
  });

  test.skip('로그인 버튼 클릭 시 /auth/login으로 이동', async ({ page }) => {
    // /auth/login 페이지 미구현으로 skip
    await page.click('[data-testid="login-link"]');
    expect(page.url()).toContain('/auth/login');
  });
});

test.describe('Navigation Active State', () => {
  test('/boards 경로에서 트립토크 메뉴 active', async ({ page }) => {
    await page.goto('http://localhost:3000/boards');
    await page.waitForSelector('[data-testid="boards-page"]', { timeout: 500 });
    
    const navBoards = page.locator('[data-testid="nav-boards"]');
    await expect(navBoards).toHaveClass(/navLinkActive/);
  });

  test.skip('/products 경로에서 숙박권 구매 메뉴 active', async ({ page }) => {
    // /products 페이지 미구현으로 skip
    await page.goto('http://localhost:3000/products');
    
    const navProducts = page.locator('[data-testid="nav-products"]');
    await expect(navProducts).toHaveClass(/navLinkActive/);
  });

  test.skip('/mypage 경로에서 마이페이지 메뉴 active', async ({ page }) => {
    // /mypage 페이지 미구현으로 skip
    await page.goto('http://localhost:3000/mypage');
    
    const navMypage = page.locator('[data-testid="nav-mypage"]');
    await expect(navMypage).toHaveClass(/navLinkActive/);
  });
});

