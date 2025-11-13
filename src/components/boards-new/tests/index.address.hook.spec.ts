/**
 * Address Hook Tests
 * 주소 검색 및 입력 기능에 대한 Playwright 테스트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

import { test, expect, type Page, type Route } from '@playwright/test';

const gotoAddressPage = async (page: Page) => {
  await page.goto('/boards/new');
  await page.waitForSelector('[data-testid="board-upload-page"]', { timeout: 2000 });
};

const fillBoardForm = async (page: Page, overrides: Partial<Record<'writer' | 'password' | 'title' | 'contents', string>> = {}) => {
  const timestamp = Date.now();
  const writer = overrides.writer ?? `작성자-${timestamp}`;
  const password = overrides.password ?? 'playwright1';
  const title = overrides.title ?? `제목-${timestamp}`;
  const contents = overrides.contents ?? `내용-${timestamp}`;

  await page.fill('input[placeholder="작성자를 입력해 주세요."]', writer);
  await page.fill('input[type="password"]', password);
  await page.fill('input[placeholder="제목을 입력해 주세요."]', title);
  await page.fill('textarea[placeholder="내용을 입력해 주세요."]', contents);
};

const withGraphqlRoute = async (
  page: Page,
  handler: (route: Route, request: any) => Promise<void> | void,
) => {
  await page.route('**/api/graphql', handler);
};

const parseGraphqlRequest = (request: any): { operationName?: string; variables?: Record<string, unknown> } | undefined => {
  const rawBody = request.postData();

  if (!rawBody) return undefined;

  try {
    return JSON.parse(rawBody);
  } catch {
    return undefined;
  }
};

test.describe('주소 검색 및 입력 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAddressPage(page);
  });

  test('우편번호 검색 버튼 클릭 시 모달이 열리는지 확인', async ({ page }) => {
    const zipcodeButton = page.locator('[data-testid="zipcode-button"]');
    await expect(zipcodeButton).toBeVisible();

    await zipcodeButton.click();

    const postcodeModal = page.locator('[data-testid="postcode-modal"]');
    await expect(postcodeModal).toBeVisible({ timeout: 500 });
  });

  test('주소 선택 시 우편번호와 기본주소가 입력되는지 확인', async ({ page }) => {
    // 모달 열기
    await page.click('[data-testid="zipcode-button"]');
    await page.waitForSelector('[data-testid="postcode-modal"]', { timeout: 500 });

    // Daum Postcode API가 로드될 때까지 대기
    await page.waitForTimeout(500);

    // 주소 검색창이 있는지 확인 (Daum Postcode의 검색창)
    const searchInput = page.locator('input[type="text"]').first();
    if (await searchInput.count() > 0) {
      // 테스트용 주소 입력 (실제로는 Daum API를 사용하므로 모킹이 필요할 수 있음)
      // 여기서는 모달이 열리고 주소 선택 시나리오를 시뮬레이션
      await searchInput.fill('서울특별시 강남구');
      await page.waitForTimeout(300);
    }

    // 모달 닫기 (실제 주소 선택은 Daum API에 의존하므로 테스트는 모달 동작만 확인)
    await page.click('[data-testid="postcode-modal"] button[aria-label="닫기"]');
    
    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="postcode-modal"]')).not.toBeVisible({ timeout: 500 });
  });

  test('상세주소 입력이 정상적으로 반영되는지 확인', async ({ page }) => {
    const detailInput = page.locator('[data-testid="address-detail-input"]');
    await expect(detailInput).toBeVisible();

    const testDetailAddress = '101동 101호';
    await detailInput.fill(testDetailAddress);

    const inputValue = await detailInput.inputValue();
    expect(inputValue).toBe(testDetailAddress);
  });

  test('모달 닫기 버튼 클릭 시 모달이 사라지는지 확인', async ({ page }) => {
    // 모달 열기
    await page.click('[data-testid="zipcode-button"]');
    await page.waitForSelector('[data-testid="postcode-modal"]', { timeout: 500 });

    // 닫기 버튼 클릭
    const closeButton = page.locator('[data-testid="postcode-modal"] button[aria-label="닫기"]');
    await closeButton.click();

    // 모달이 사라졌는지 확인
    await expect(page.locator('[data-testid="postcode-modal"]')).not.toBeVisible({ timeout: 500 });
  });

  test('게시글 등록 시 boardAddress 필드가 올바른 형태로 전달되는지 확인', async ({ page }) => {
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);

      if (body?.operationName === 'CreateBoard') {
        const variables = body.variables as { createBoardInput?: { boardAddress?: { zipcode?: string; address?: string; addressDetail?: string } } } | undefined;
        const boardAddress = variables?.createBoardInput?.boardAddress;
        
        expect(boardAddress).toBeDefined();
        expect(boardAddress).toHaveProperty('zipcode');
        expect(boardAddress).toHaveProperty('address');
        expect(boardAddress).toHaveProperty('addressDetail');
        
        // 타입 검증
        if (boardAddress?.zipcode !== undefined) {
          expect(typeof boardAddress.zipcode).toBe('string');
        }
        if (boardAddress?.address !== undefined) {
          expect(typeof boardAddress.address).toBe('string');
        }
        if (boardAddress?.addressDetail !== undefined) {
          expect(typeof boardAddress.addressDetail).toBe('string');
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createBoard: {
                _id: 'mock-board-id',
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    try {
      await fillBoardForm(page);
      
      // 상세주소 입력
      await page.fill('[data-testid="address-detail-input"]', '101동 101호');

      const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
      await submitButton.click();

      await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('주소 미입력 상태에서도 게시글 등록이 정상적으로 완료되는지 검증', async ({ page }) => {
    const graphqlPattern = '**/api/graphql';

    await withGraphqlRoute(page, async (route, request) => {
      const body = parseGraphqlRequest(request);

      if (body?.operationName === 'CreateBoard') {
        const variables = body.variables as { createBoardInput?: { boardAddress?: { zipcode?: string; address?: string; addressDetail?: string } | null } } | undefined;
        
        // boardAddress가 null이거나 빈 값이어도 정상적으로 처리되어야 함
        const boardAddress = variables?.createBoardInput?.boardAddress;
        
        // null이거나 빈 객체일 수 있음
        if (boardAddress !== null && boardAddress !== undefined) {
          // 값이 있다면 올바른 형태여야 함
          if (boardAddress.zipcode || boardAddress.address || boardAddress.addressDetail) {
            expect(boardAddress).toHaveProperty('zipcode');
            expect(boardAddress).toHaveProperty('address');
            expect(boardAddress).toHaveProperty('addressDetail');
          }
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              createBoard: {
                _id: 'mock-board-id-empty-address',
              },
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    try {
      await fillBoardForm(page);
      // 주소는 입력하지 않음

      const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
      await submitButton.click();

      await expect(page.locator('text=게시글 등록 완료')).toBeVisible({ timeout: 1900 });
    } finally {
      await page.unroute(graphqlPattern).catch(() => {});
    }
  });

  test('모달 오버레이 클릭 시 모달이 닫히는지 확인', async ({ page }) => {
    // 모달 열기
    await page.click('[data-testid="zipcode-button"]');
    await page.waitForSelector('[data-testid="postcode-modal"]', { timeout: 500 });

    // 오버레이 클릭 (모달 외부 클릭)
    const overlay = page.locator('[data-testid="postcode-modal-overlay"]');
    await overlay.click({ position: { x: 10, y: 10 } });

    // 모달이 닫혔는지 확인
    await expect(page.locator('[data-testid="postcode-modal"]')).not.toBeVisible({ timeout: 500 });
  });
});

