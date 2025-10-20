import { test, expect } from '@playwright/test';

/**
 * Layout Area Visibility Tests
 * URL별 header/banner 영역 노출 여부를 테스트
 */

test.describe('Layout Area Visibility - Header & Banner', () => {
  
  test('/boards - header와 banner 모두 표시', async ({ page }) => {
    await page.goto('/boards');
    
    // 페이지 로드 완료 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
    
    // header 표시 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // logo 표시 확인
    const logo = page.locator('[data-testid="logo-link"]');
    await expect(logo).toBeVisible();
    
    // banner 표시 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
  });

  test('/boards/new - header 표시, banner 미표시', async ({ page }) => {
    await page.goto('/boards/new');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
    
    // header 표시 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // logo 표시 확인
    const logo = page.locator('[data-testid="logo-link"]');
    await expect(logo).toBeVisible();
    
    // banner 미표시 확인 (DOM에 존재하지 않아야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toHaveCount(0);
  });

  test('/boards/123 - header 표시, banner 미표시', async ({ page }) => {
    await page.goto('/boards/123');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
    
    // header 표시 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // logo 표시 확인
    const logo = page.locator('[data-testid="logo-link"]');
    await expect(logo).toBeVisible();
    
    // banner 미표시 확인 (DOM에 존재하지 않아야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toHaveCount(0);
  });

  test('/products/new - header 표시, banner 미표시', async ({ page }) => {
    await page.goto('/products/new');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
    
    // header 표시 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // logo 표시 확인
    const logo = page.locator('[data-testid="logo-link"]');
    await expect(logo).toBeVisible();
    
    // banner 미표시 확인 (DOM에 존재하지 않아야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toHaveCount(0);
  });

  test('/products/123 - header 표시, banner 미표시', async ({ page }) => {
    await page.goto('/products/123');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-container"]', { timeout: 500 });
    
    // header 표시 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // logo 표시 확인
    const logo = page.locator('[data-testid="logo-link"]');
    await expect(logo).toBeVisible();
    
    // banner 미표시 확인 (DOM에 존재하지 않아야 함)
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toHaveCount(0);
  });

  // Skip 대상 페이지들은 테스트하지 않음
  // - /auth/login
  // - /auth/signup
  // - /products
  // - /mypage
});

