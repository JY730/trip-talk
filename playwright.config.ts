import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정 파일
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // testDir: './tests',
  
  // /* 병렬 실행 설정 */
  // fullyParallel: true,
  
  // /* CI 환경에서 재시도 설정 */
  // forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  
  // /* CI 환경에서 worker 수 설정 */
  // workers: process.env.CI ? 1 : undefined,
  
  // /* 리포터 설정 */
  // reporter: 'html',
  
  /* 모든 테스트에 적용되는 공통 설정 */
  use: {
    /* 실패한 테스트의 스크린샷 및 비디오 저장 */
    // trace: 'on-first-retry',
    
    /* 베이스 URL 설정 (필요시 수정) */
    baseURL: 'http://localhost:3000',
  },

  /* 테스트할 브라우저 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* 모바일 뷰포트 테스트 (필요시 활성화) */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* 개발 서버 자동 시작 설정 (필요시 활성화) */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

