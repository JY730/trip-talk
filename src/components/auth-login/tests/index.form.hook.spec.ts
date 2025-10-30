import { test, expect } from '@playwright/test';

// 공통 유틸: 페이지 로드 대기 (data-testid 기반)
async function waitForLoginPage(page: any) {
  await page.goto('/auth/login');
  await page.getByTestId('auth-login-page').waitFor();
}

test.describe('Auth Login Form', () => {
  test('성공 시나리오: accessToken과 유저정보 저장 및 /boards 이동', async ({ page }) => {
    test.setTimeout(2000); // 네트워크 통신 케이스: 2000ms 미만 요구사항 준수

    await waitForLoginPage(page);

    // 입력
    await page.getByPlaceholder('이메일을 입력해 주세요.').fill('a@c.com');
    await page.getByPlaceholder('비밀번호를 입력해 주세요.').fill('1234qwer');

    // 버튼 활성화 확인 후 클릭
    const loginButton = page.getByRole('button', { name: '로그인' });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // 완료 모달 확인 및 확인 클릭
    const confirmButton = page.getByRole('button', { name: '확인' });
    await confirmButton.waitFor();
    await confirmButton.click();

    // 이동 확인
    await expect(page).toHaveURL(/\/boards$/);

    // localStorage 검증
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeTruthy();

    const user = await page.evaluate(() => {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    });
    expect(user?._id).toBeTruthy();
    expect(user?.name).toBeTruthy();
  });

  test('실패 시나리오: API 모킹 시 실패 모달 노출 및 닫기', async ({ page }) => {
    // 네트워크 미사용(모킹) 테스트: 별도 timeout 설정 없음 또는 500ms 미만
    test.setTimeout(500);

    // /api/graphql 요청 모킹 (loginUser 실패 응답)
    await page.route('/api/graphql', async (route) => {
      const req = await route.request().postDataJSON();
      const isLogin = String(req?.query || '').includes('loginUser');
      if (isLogin) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Invalid credentials' }],
            data: { loginUser: null },
          }),
        });
      }
      // 다른 쿼리는 통과
      return route.fallback();
    });

    await waitForLoginPage(page);

    await page.getByPlaceholder('이메일을 입력해 주세요.').fill('wrong@example.com');
    await page.getByPlaceholder('비밀번호를 입력해 주세요.').fill('wrong');

    const loginButton = page.getByRole('button', { name: '로그인' });
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // 실패 모달의 확인 클릭 시 닫히는지 확인 (경로 유지)
    const confirmButton = page.getByRole('button', { name: '확인' });
    await confirmButton.waitFor();
    await confirmButton.click();

    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});


