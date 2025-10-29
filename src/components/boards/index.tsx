'use client';

/**
 * Boards Component
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-10-21
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { SearchBar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { useBoardsBinding } from './hooks/index.binding.hook';
import styles from './styles.module.css';

const { RangePicker } = DatePicker;

/**
 * 날짜 포맷팅 함수
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (YYYY.MM.DD)
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * Boards 컴포넌트
 * 트립토크 게시글 목록을 표시하고 검색, 페이지네이션 기능을 제공합니다.
 */
export default function Boards() {
  const router = useRouter();
  
  // API 데이터 조회
  const { boards, totalCount, loading, error, refetch } = useBoardsBinding();
  
  // State 관리
  const [searchValue, setSearchValue] = useState('');
  const [selectedRange, setSelectedRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const dateFormat = 'YYYY-MM-DD';

  /**
   * 검색어 입력 핸들러
   * @param value - 검색어
   */
  const handleSearch = (value: string) => {
    console.log('검색어:', value);
    // TODO: 실제 검색 로직 구현
  };

  /**
   * 날짜 범위 변경 핸들러
   * @param dates - 시작/종료 날짜 배열
   */
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setSelectedRange(dates || [null, null]);
  };

  /**
   * 검색 버튼 클릭 핸들러
   */
  const handleSearchClick = () => {
    console.log('검색 실행:', { searchValue, selectedRange });
    // TODO: 실제 검색 로직 구현
  };

  /**
   * 트립토크 등록 버튼 클릭 핸들러
   */
  const handleWriteClick = () => {
    router.push('/boards/new');
  };

  /**
   * 게시글 제목 클릭 핸들러
   * @param boardId - 게시글 ID
   */
  const handleBoardClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
  };

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('페이지 변경:', page);
  };

  /**
   * 게시글 번호 계산 함수
   * @param index - 배열 인덱스
   * @returns 게시글 번호
   */
  const getBoardNumber = (index: number): number => {
    return totalCount - index;
  };

  return (
    <div className={styles.container}>
      {/* 타이틀 영역 */}
      <div className={styles.titleSection}>
        <h1 className={styles.title}>트립토크 게시판</h1>
      </div>

      {/* 검색 영역 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <SearchBar
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="제목을 검색해 주세요."
              size="large"
              theme="light"
              containerClassName={styles.searchBarContainer}
            />
          </div>

          <div className={styles.datePickerBox}>
            <RangePicker
              value={selectedRange}
              onChange={handleRangeChange}
              placeholder={['YYYY-MM-DD', 'YYYY-MM-DD']}
              format={dateFormat}
              allowClear={false}
              suffixIcon={<img src="/icons/calendar.svg" alt="calendar icon" className={styles.calendarIcon} />}
            />
          </div>

          <div className={styles.searchButtonBox}>
            <Button
              variant="secondary"
              styleType="filled"
              size="large"
              theme="light"
              shape="rectangle"
              onClick={handleSearchClick}
            >
              검색
            </Button>
          </div>
        </div>

        <div className={styles.writeButton}>
          <Button
            variant="primary"
            styleType="filled"
            size="large"
            theme="light"
            shape="rectangle"
            leftIcon={
              <img 
                src="/icons/submit.svg" 
                alt="등록" 
              />
            }
            onClick={handleWriteClick}
          >
            트립토크 등록
          </Button>
        </div>
      </div>

      {/* Main 영역 - 게시글 목록 */}
      <div className={styles.mainSection}>
        {/* 게시글 헤더 */}
        <div className={styles.boardHeaderContainer}>
          <div className={styles.boardHeader}>
            <div className={styles.headerNumber}>번호</div>
            <div className={styles.headerTitle}>제목</div>
            <div className={styles.headerAuthor}>작성자</div>
            <div className={styles.headerDate}>날짜</div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className={styles.boardListContainer} data-testid="board-list">
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingText}>로딩 중입니다.</div>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorText}>{error}</div>
              <Button
                variant="secondary"
                styleType="filled"
                size="medium"
                theme="light"
                shape="rectangle"
                onClick={refetch}
              >
                다시 시도
              </Button>
            </div>
          ) : (
            boards.map((board, index) => (
              <div key={board._id} className={styles.boardItem}>
                <div className={styles.boardNumber}>{getBoardNumber(index)}</div>
                <div 
                  className={styles.boardTitle}
                  onClick={() => handleBoardClick(board._id)}
                  style={{ cursor: 'pointer' }}
                >
                  {board.title}
                </div>
                <div className={styles.boardAuthor}>{board.writer}</div>
                <div className={styles.boardDate}>{formatDate(board.createdAt)}</div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.paginationContainer}>
          <Pagination
            variant="primary"
            size="medium"
            theme="light"
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / 10)}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      </div>
    </div>
  );
}
