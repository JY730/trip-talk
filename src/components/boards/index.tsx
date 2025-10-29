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
import styles from './styles.module.css';

const { RangePicker } = DatePicker;

/**
 * 게시글 데이터 타입
 */
interface BoardItem {
  id: number;
  title: string;
  author: string;
  date: string;
}

/**
 * Mock 게시글 데이터 (피그마 디자인 기반)
 */
const mockBoardData: BoardItem[] = [
  { id: 243, title: '제주 살이 1일차', author: '홍길동', date: '2024.12.16' },
  { id: 242, title: '강남 살이 100년차', author: '홍길동', date: '2024.12.16' },
  { id: 241, title: '길 걷고 있었는데 고양이한테 간택 받았어요', author: '홍길동', date: '2024.12.16' },
  { id: 240, title: '오늘 날씨 너무 좋아서 바다보러 왔어요~', author: '홍길동', date: '2024.12.16' },
  { id: 239, title: '누가 양양 핫하다고 했어 나밖에 없는데?', author: '홍길동', date: '2024.12.16' },
  { id: 238, title: '여름에 보드타고 싶은거 저밖에 없나요 🥲', author: '홍길동', date: '2024.12.16' },
  { id: 237, title: '사무실에서 과자 너무 많이 먹은거 같아요 다이어트하러 여행 가야겠어요', author: '홍길동', date: '2024.12.16' },
  { id: 236, title: '여기는 기승전 여행이네요 ㅋㅋㅋ', author: '홍길동', date: '2024.12.16' },
  { id: 235, title: '상여금 들어왔는데 이걸로 다낭갈까 사이판 갈까', author: '홍길동', date: '2024.12.16' },
  { id: 234, title: '강릉 여름바다 보기 좋네요', author: '홍길동', date: '2024.12.16' },
];

/**
 * Boards 컴포넌트
 * 트립토크 게시글 목록을 표시하고 검색, 페이지네이션 기능을 제공합니다.
 */
export default function Boards() {
  const router = useRouter();
  
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
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log('페이지 변경:', page);
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
        <div className={styles.boardListContainer}>
          {mockBoardData.map((board) => (
            <div key={board.id} className={styles.boardItem}>
              <div className={styles.boardNumber}>{board.id}</div>
              <div className={styles.boardTitle}>{board.title}</div>
              <div className={styles.boardAuthor}>{board.author}</div>
              <div className={styles.boardDate}>{board.date}</div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className={styles.paginationContainer}>
          <Pagination
            variant="primary"
            size="medium"
            theme="light"
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      </div>
    </div>
  );
}
