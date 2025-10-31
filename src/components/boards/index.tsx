'use client';

/**
 * Boards Component
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-10-21
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { SearchBar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { useAuthStore } from '@/commons/stores/useAuth.store';
import usePagination from './hooks/index.pagination.hook';
import useBoardDelete from './hooks/index.delete.hook';
import BestBoards from './best';
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
  const { openModal, closeModal } = useModal();
  const accessToken = useAuthStore((s) => s.accessToken);
  
  // State 관리
  const [searchValue, setSearchValue] = useState('');
  const [selectedRange, setSelectedRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  
  // 디바운싱을 위한 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 페이지네이션 훅 사용
  const {
    boards,
    totalCount,
    totalPages,
    currentPage,
    loading,
    error,
    setCurrentPage,
    setSearch,
    setDateRange,
    refetch,
  } = usePagination({
    search: searchValue,
    startDate: selectedRange[0],
    endDate: selectedRange[1],
  });

  const {
    onDelete,
    loading: deleteLoading,
    canDelete,
    pendingBoardId,
  } = useBoardDelete({
    onReload: refetch,
  });

  // Constants
  const dateFormat = 'YYYY-MM-DD';
  
  // 디바운싱된 검색 함수
  useEffect(() => {
    // 이전 타이머가 있으면 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // 디바운싱 시간: 500ms
    debounceTimerRef.current = setTimeout(() => {
      // 검색어를 대소문자 구분 없이 처리 (API에 전달 시 원본 유지)
      setSearch(searchValue);
    }, 500);
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchValue, setSearch]);

  /**
   * 검색어 입력 핸들러
   * @param value - 검색어
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // 디바운싱으로 인해 자동으로 검색이 실행됨
  };

  /**
   * 검색어 지우기 핸들러
   */
  const handleClear = () => {
    setSearchValue('');
    // 디바운싱 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // 즉시 검색 초기화
    setSearch('');
  };

  /**
   * 날짜 범위 변경 핸들러
   * @param dates - 시작/종료 날짜 배열
   */
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    const newRange = dates || [null, null];
    setSelectedRange(newRange);
    setDateRange(newRange[0], newRange[1]);
  };

  /**
   * 검색 버튼 클릭 핸들러
   */
  const handleSearchClick = () => {
    // 디바운싱 타이머 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // 즉시 검색 실행
    setSearch(searchValue);
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
    // 비로그인 사용자는 현재 페이지에서 로그인 요청 모달을 먼저 보여주고, 로그인 페이지로 이동
    if (!accessToken) {
      openModal(
        <Modal
          variant="info"
          actions="single"
          title="로그인이 필요합니다"
          description="서비스 이용을 위해 로그인해주세요."
          confirmText="확인"
          onConfirm={() => {
            closeModal();
            router.push('/auth/login');
          }}
        />
      );
      return;
    }

    // 로그인 상태라면 상세 페이지로 이동
    router.push(`/boards/${boardId}`);
  };

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * 게시글 번호 계산 함수
   * @param index - 배열 인덱스
   * @returns 게시글 번호
   */
  const getBoardNumber = (index: number): number => {
    return totalCount - (currentPage - 1) * 10 - index;
  };

  const handleDeleteBoard = useCallback(
    (boardId: string) => {
      void onDelete(boardId);
    },
    [onDelete]
  );

  const safeBoards = boards ?? [];

  return (
    <div className={styles.container}>
      <BestBoards />
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
              onClear={handleClear}
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
              <div className={styles.errorText}>데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.</div>
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
            safeBoards.map((board, index) => {
              const isDeleting = pendingBoardId === board._id && deleteLoading;

              return (
                <div
                  key={board._id}
                  className={styles.boardItem}
                  data-testid={`board-item-${board._id}`}
                >
                  <div className={styles.boardNumber}>{getBoardNumber(index)}</div>
                  <div
                    className={styles.boardTitle}
                    onClick={() => handleBoardClick(board._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar') {
                        event.preventDefault();
                        handleBoardClick(board._id);
                      }
                    }}
                    data-testid={`board-title-${board._id}`}
                  >
                    {board.title}
                  </div>
                  <div className={styles.boardAuthor}>{board.writer}</div>
                  <div className={styles.boardDate}>{formatDate(board.createdAt)}</div>
                  {canDelete && (
                    <button
                      type="button"
                      className={styles.boardDeleteButton}
                      aria-label="게시글 삭제"
                      data-testid={`board-delete-${board._id}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteBoard(board._id);
                      }}
                      disabled={isDeleting}
                    >
                      <img src="/icons/delete.svg" alt="delete icon" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.paginationContainer}>
          <Pagination
            variant="primary"
            size="medium"
            theme="light"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      </div>
    </div>
  );
}
