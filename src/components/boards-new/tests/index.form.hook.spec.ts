/**
 * Board Form Hook Tests
 * 게시글 등록 폼 기능에 대한 Playwright 테스트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

import { test, expect } from '@playwright/test';

test.describe('게시글 등록 폼 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 게시글 등록 페이지로 직접 이동
    await page.goto('/boards/new');
    
    // 게시글 등록 페이지가 로드될 때까지 대기
    await page.waitForSelector('h1:has-text("게시글 등록")', { timeout: 5000 });
  });

  test('모든 필수 필드가 입력되지 않으면 등록하기 버튼이 비활성화되어야 함', async ({ page }) => {
    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
    await expect(submitButton).toBeDisabled();
  });

  test('모든 필수 필드가 입력되면 등록하기 버튼이 활성화되어야 함', async ({ page }) => {
    // 필수 필드들 입력
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', '테스트 작성자');
    await page.fill('input[type="password"]', 'test123');
    await page.fill('input[placeholder="제목을 입력해 주세요."]', '테스트 제목');
    await page.fill('textarea[placeholder="내용을 입력해 주세요."]', '테스트 내용입니다.');

    // 등록하기 버튼이 활성화되어 있는지 확인
    const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
    await expect(submitButton).toBeEnabled();
  });

  test('게시글 등록 성공 시나리오', async ({ page }) => {
    // 필수 필드들 입력
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', '테스트 작성자');
    await page.fill('input[type="password"]', 'test123');
    await page.fill('input[placeholder="제목을 입력해 주세요."]', '테스트 제목');
    await page.fill('textarea[placeholder="내용을 입력해 주세요."]', '테스트 내용입니다.');

    // 등록하기 버튼 클릭
    await page.click('button[type="submit"]:has-text("등록하기")');

    // 등록완료 모달이 표시되는지 확인
    await expect(page.locator('text=게시글 등록 완료')).toBeVisible();
    await expect(page.locator('text=게시글이 성공적으로 등록되었습니다.')).toBeVisible();

    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 상세페이지로 이동했는지 확인 (URL 패턴 확인)
    await expect(page).toHaveURL(/\/boards\/\d+/);
  });

  test('로컬스토리지에 게시글 데이터가 저장되는지 확인', async ({ page }) => {
    // 필수 필드들 입력
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', '테스트 작성자');
    await page.fill('input[type="password"]', 'test123');
    await page.fill('input[placeholder="제목을 입력해 주세요."]', '테스트 제목');
    await page.fill('textarea[placeholder="내용을 입력해 주세요."]', '테스트 내용입니다.');

    // 등록하기 버튼 클릭
    await page.click('button[type="submit"]:has-text("등록하기")');

    // 등록완료 모달 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 로컬스토리지에서 boards 데이터 확인
    const boardsData = await page.evaluate(() => {
      return localStorage.getItem('boards');
    });

    expect(boardsData).toBeTruthy();
    
    const boards = JSON.parse(boardsData!);
    expect(boards).toHaveLength(1);
    expect(boards[0]).toMatchObject({
      id: "1",
      title: '테스트 제목',
      content: '테스트 내용입니다.',
      createdAt: expect.any(String)
    });
  });

  test('기존 게시글이 있을 때 새 게시글 ID가 올바르게 생성되는지 확인', async ({ page }) => {
    // 기존 boards 데이터 설정
    await page.evaluate(() => {
      localStorage.setItem('boards', JSON.stringify([
        { id: 1, title: '기존 게시글', content: '기존 내용', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 3, title: '기존 게시글2', content: '기존 내용2', createdAt: '2024-01-02T00:00:00.000Z' }
      ]));
    });

    // 페이지 새로고침
    await page.reload();

    // 필수 필드들 입력
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', '테스트 작성자');
    await page.fill('input[type="password"]', 'test123');
    await page.fill('input[placeholder="제목을 입력해 주세요."]', '새 게시글');
    await page.fill('textarea[placeholder="내용을 입력해 주세요."]', '새 내용입니다.');

    // 등록하기 버튼 클릭
    await page.click('button[type="submit"]:has-text("등록하기")');

    // 등록완료 모달 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 로컬스토리지에서 boards 데이터 확인
    const boardsData = await page.evaluate(() => {
      return localStorage.getItem('boards');
    });

    const boards = JSON.parse(boardsData!);
    expect(boards).toHaveLength(3);
    
    // 새 게시글의 ID가 "4"인지 확인 (기존 최대 ID 3 + 1)
    const newBoard = boards.find((board: any) => board.title === '새 게시글');
    expect(newBoard.id).toBe("4");
  });

  test('취소 버튼 클릭 시 이전 페이지로 이동하는지 확인', async ({ page }) => {
    // /boards 페이지로 먼저 이동
    await page.goto('/boards');
    
    // 게시글 등록 페이지로 이동
    await page.goto('/boards/new');
    
    // 취소 버튼 클릭
    await page.click('button:has-text("취소")');

    // 이전 페이지(/boards)로 이동했는지 확인
    await expect(page).toHaveURL('/boards');
  });

  test('유효성 검사 오류 메시지가 표시되는지 확인', async ({ page }) => {
    // 제목 필드만 입력
    await page.fill('input[placeholder="제목을 입력해 주세요."]', '테스트 제목');
    
    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('button[type="submit"]:has-text("등록하기")');
    await expect(submitButton).toBeDisabled();

    // 작성자 필드에 값을 입력하고 지우기 (유효성 검사 트리거)
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', 'test');
    await page.fill('input[placeholder="작성자를 입력해 주세요."]', '');
    await page.locator('input[placeholder="작성자를 입력해 주세요."]').blur();

    // 잠시 대기 후 오류 메시지가 표시되는지 확인
    await page.waitForTimeout(100);
    await expect(page.locator('text=작성자를 입력해 주세요.')).toBeVisible();
  });
});
