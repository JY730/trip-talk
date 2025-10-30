/**
 * Auth Signup Form Hook Tests
 * 회원가입 폼 기능에 대한 Playwright 테스트
 * Last Updated: 2025-01-27
 */

import { test, expect } from '@playwright/test';

test.describe('회원가입 폼 훅 - TDD 기반 회원가입 시나리오', () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 직접 이동
    await page.goto('/auth/signup');
    
    // 회원가입 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="signup-page"]', { timeout: 2000 });
  });

  test('모든 필수 필드가 입력되지 않으면 회원가입 버튼이 비활성화되어야 함', async ({ page }) => {
    // 회원가입 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="signup-submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('모든 필수 필드가 입력되면 회원가입 버튼이 활성화되어야 함', async ({ page }) => {
    // 필수 필드들 입력
    const timestamp = Date.now();
    await page.fill('[data-testid="signup-email"] input', `test${timestamp}@example.com`);
    await page.fill('[data-testid="signup-name"] input', '테스트 사용자');
    await page.fill('[data-testid="signup-password"] input', 'password123');
    await page.fill('[data-testid="signup-password-confirm"] input', 'password123');

    // 회원가입 버튼이 활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="signup-submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('성공 시나리오: 실제 API로 _id 반환 및 가입완료 모달 노출', async ({ page }) => {
    // 실제 API 호출 (모킹하지 않음)
    // 필수 필드들 입력 - timestamp를 포함한 고유한 이메일 사용
    const timestamp = Date.now();
    await page.fill('[data-testid="signup-email"] input', `test${timestamp}@example.com`);
    await page.fill('[data-testid="signup-name"] input', '테스트 사용자');
    await page.fill('[data-testid="signup-password"] input', 'password123');
    await page.fill('[data-testid="signup-password-confirm"] input', 'password123');

    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-submit"]');

    // 가입완료 모달이 표시되는지 확인 (network 통신이므로 2000ms 미만 timeout 설정)
    await expect(page.locator('text=회원가입 완료')).toBeVisible({ timeout: 1900 });
    await expect(page.locator('text=회원가입이 완료되었습니다.')).toBeVisible({ timeout: 1900 });

    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 로그인 페이지로 이동했는지 확인 - _id가 정상적으로 반환되는지 확인
    await expect(page).toHaveURL('/auth/login', { timeout: 1900 });
  });

  test('실패 시나리오: API 모킹으로 에러 발생 시 가입실패 모달 노출', async ({ page }) => {
    // GraphQL 요청 모킹 (createUser만 실패)
    await page.route('**/api/graphql', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON?.() as { query?: string; variables?: unknown };
      const isCreateUser = postData?.query?.includes('mutation createUser') || 
                          postData?.query?.includes('createUser');
      if (isCreateUser) {
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

    // 필수 필드들 입력
    const timestamp = Date.now();
    await page.fill('[data-testid="signup-email"] input', `test${timestamp}@example.com`);
    await page.fill('[data-testid="signup-name"] input', '테스트 사용자');
    await page.fill('[data-testid="signup-password"] input', 'password123');
    await page.fill('[data-testid="signup-password-confirm"] input', 'password123');
    
    // 회원가입 버튼 클릭
    await page.click('[data-testid="signup-submit"]');

    // 실패 모달이 표시되는지 확인 (network 통신이므로 2000ms 미만 timeout 설정)
    await expect(page.locator('text=가입 실패')).toBeVisible({ timeout: 1900 });
    await expect(page.locator('text=에러가 발생하였습니다. 다시 시도해 주세요.')).toBeVisible({ timeout: 1900 });

    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');
  });

});

