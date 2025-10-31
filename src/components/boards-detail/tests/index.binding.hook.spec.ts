/**
 * Board Binding Hook Tests
 * 게시글 상세 조회 기능에 대한 Playwright 테스트
 * Design Source: Figma Node IDs 285:32577, 285:32604, 285:32608, 285:32615
 * Last Updated: 2025-01-27
 */

import { test, expect, Page, Route } from '@playwright/test';

const GRAPHQL_ENDPOINT = '**/graphql';
const FETCH_BOARD_OPERATION = 'FetchBoard';

interface FetchBoardRequestBody {
  operationName?: string;
  variables?: {
    boardId?: string;
  };
}

const fulfillJson = async (route: Route, body: unknown) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
};

const setLoggedInState = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'e2e-access-token');
    window.localStorage.setItem(
      'user',
      JSON.stringify({ _id: 'e2e-user-id', name: 'E2E Tester' })
    );
    (window as unknown as { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
  });
};

const mockFetchBoard = async (
  page: Page,
  handler: (route: Route, requestBody: FetchBoardRequestBody) => Promise<void>
) => {
  await page.route(GRAPHQL_ENDPOINT, async (route) => {
    const request = route.request();

    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    let requestBody: FetchBoardRequestBody = {};
    try {
      requestBody = request.postDataJSON() as FetchBoardRequestBody;
    } catch {
      await route.continue();
      return;
    }

    if (requestBody?.operationName !== FETCH_BOARD_OPERATION) {
      await route.continue();
      return;
    }

    await handler(route, requestBody);
  });
};

test.describe('게시글 상세 조회 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await setLoggedInState(page);
  });

  test('게시글 조회 성공 시 모든 이미지가 표시된다', async ({ page }) => {
    const boardId = 'mock-board-id-success';
    const mockImages = ['/icons/good.svg', '/icons/link.svg'];
    const mockResponse = {
      data: {
        fetchBoard: {
          _id: boardId,
          writer: '테스트 작성자',
          title: '테스트 제목',
          contents: '테스트 내용입니다.',
          youtubeUrl: null,
          likeCount: 10,
          dislikeCount: 1,
          images: mockImages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          boardAddress: null,
          user: {
            _id: 'user-id',
            email: 'test@example.com',
            name: '테스트 작성자'
          }
        }
      }
    };

    await mockFetchBoard(page, async (route) => {
      await fulfillJson(route, mockResponse);
    });

    try {
      await page.goto(`/boards/${boardId}`);
      await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });

      await expect(page.locator('[data-testid="board-writer"]')).toHaveText('테스트 작성자', { timeout: 1800 });
      await expect(page.locator('[data-testid="board-title"]')).toHaveText('테스트 제목', { timeout: 1800 });
      await expect(page.locator('[data-testid="board-contents"]')).toHaveText('테스트 내용입니다.', { timeout: 1800 });

      const boardIdAttribute = await page.locator('[data-board-id]').getAttribute('data-board-id');
      expect(boardIdAttribute).toBe(boardId);

      const images = page.locator('[data-testid="board-image"]');
      await expect(images).toHaveCount(mockImages.length, { timeout: 1800 });
      for (let index = 0; index < mockImages.length; index += 1) {
        await expect(images.nth(index)).toBeVisible({ timeout: 1800 });
      }
    } finally {
      await page.unroute(GRAPHQL_ENDPOINT);
    }
  });

  test('이미지 데이터가 없을 때 이미지 영역이 렌더링되지 않는다', async ({ page }) => {
    const boardId = 'mock-board-id-without-images';
    const mockResponse = {
      data: {
        fetchBoard: {
          _id: boardId,
          writer: '이미지 없음 작성자',
          title: '이미지 없음 제목',
          contents: '이미지 없음 내용',
          youtubeUrl: null,
          likeCount: 0,
          dislikeCount: 0,
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          boardAddress: null,
          user: null
        }
      }
    };

    await mockFetchBoard(page, async (route) => {
      await fulfillJson(route, mockResponse);
    });

    try {
      await page.goto(`/boards/${boardId}`);
      await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });

      await expect(page.locator('[data-testid="board-title"]')).toHaveText('이미지 없음 제목', { timeout: 1800 });
      await expect(page.locator('[data-testid="board-image"]')).toHaveCount(0, { timeout: 1000 });
    } finally {
      await page.unroute(GRAPHQL_ENDPOINT);
    }
  });

  test('게시글 조회 실패 시 에러 메시지를 표시하고 이미지 영역에 접근 오류가 없다', async ({ page }) => {
    const boardId = 'mock-board-id-error';
    const errorResponse = {
      data: {
        fetchBoard: null
      },
      errors: [
        {
          message: 'Board not found'
        }
      ]
    };

    await mockFetchBoard(page, async (route) => {
      await fulfillJson(route, errorResponse);
    });

    try {
      await page.goto(`/boards/${boardId}`);
      await page.waitForSelector('[data-testid="board-detail-page"]', { timeout: 2000 });

      await expect(page.locator('text=게시글 정보를 불러올 수 없습니다.')).toBeVisible({ timeout: 1800 });
      await expect(page.locator('[data-testid="board-image"]')).toHaveCount(0, { timeout: 1000 });
    } finally {
      await page.unroute(GRAPHQL_ENDPOINT);
    }
  });
});

