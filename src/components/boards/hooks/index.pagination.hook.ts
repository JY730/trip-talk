'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import type { Dayjs } from 'dayjs';

/**
 * GraphQL 쿼리 정의
 */
const FETCH_BOARDS = gql`
  query FetchBoards($page: Int, $search: String, $startDate: DateTime, $endDate: DateTime) {
    fetchBoards(page: $page, search: $search, startDate: $startDate, endDate: $endDate) {
      _id
      title
      writer
      createdAt
    }
  }
`;

const FETCH_BOARDS_COUNT = gql`
  query FetchBoardsCount($search: String, $startDate: DateTime, $endDate: DateTime) {
    fetchBoardsCount(search: $search, startDate: $startDate, endDate: $endDate)
  }
`;

/**
 * 게시글 데이터 타입
 */
export interface BoardItem {
  _id: string;
  title: string;
  writer: string;
  createdAt: string;
}

/**
 * 게시글 목록 응답 타입
 */
interface FetchBoardsResponse {
  fetchBoards: BoardItem[];
}

/**
 * 게시글 개수 응답 타입
 */
interface FetchBoardsCountResponse {
  fetchBoardsCount: number;
}

/**
 * 페이지네이션 훅의 파라미터 타입
 */
export interface UsePaginationParams {
  search?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}

/**
 * 페이지네이션 훅의 반환 타입
 */
export interface UsePaginationReturn {
  // 데이터
  boards: BoardItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  
  // 상태
  loading: boolean;
  error: Error | null;
  
  // 액션
  setCurrentPage: (page: number) => void;
  setSearch: (search: string) => void;
  setDateRange: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  refetch: () => void;
  
  // 계산된 값
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * 페이지네이션 커스텀 훅
 * 게시글 목록을 페이지네이션과 함께 조회하는 훅
 * 
 * @param initialParams - 초기 검색 조건
 * @returns 페이지네이션 관련 상태와 액션
 */
export default function usePagination(initialParams: UsePaginationParams = {}): UsePaginationReturn {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(initialParams.search || '');
  const [startDate, setStartDate] = useState<Dayjs | null>(initialParams.startDate || null);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialParams.endDate || null);

  // 날짜 포맷팅 함수
  const formatDate = (date: Dayjs | null): string | undefined => {
    return date ? date.format('YYYY-MM-DD') : undefined;
  };

  // 시작일 포맷팅 함수 (00:00:00으로 설정)
  const formatStartDate = (date: Dayjs | null): string | undefined => {
    return date ? date.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : undefined;
  };

  // 종료일 포맷팅 함수 (23:59:59로 설정)
  const formatEndDate = (date: Dayjs | null): string | undefined => {
    return date ? date.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : undefined;
  };

  // GraphQL 쿼리 변수
  const queryVariables = {
    page: currentPage,
    search: search || undefined,
    startDate: formatStartDate(startDate),
    endDate: formatEndDate(endDate),
  };

  // 게시글 목록 조회
  const {
    data: boardsData,
    loading: boardsLoading,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery<FetchBoardsResponse>(FETCH_BOARDS, {
    variables: queryVariables,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // 게시글 개수 조회
  const {
    data: countData,
    loading: countLoading,
    error: countError,
    refetch: refetchCount,
  } = useQuery<FetchBoardsCountResponse>(FETCH_BOARDS_COUNT, {
    variables: {
      search: search || undefined,
      startDate: formatStartDate(startDate),
      endDate: formatEndDate(endDate),
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // 페이지 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  // 계산된 값들
  const boards = boardsData?.fetchBoards || [];
  const totalCount = countData?.fetchBoardsCount || 0;
  const totalPages = Math.ceil(totalCount / 10);
  const loading = boardsLoading || countLoading;
  const error = boardsError || countError || null;

  // 페이지네이션 상태
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const startIndex = (currentPage - 1) * 10 + 1;
  const endIndex = Math.min(currentPage * 10, totalCount);

  // refetch 함수
  const refetch = () => {
    refetchBoards();
    refetchCount();
  };

  // 날짜 범위 설정 함수
  const setDateRange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return {
    // 데이터
    boards,
    totalCount,
    totalPages,
    currentPage,
    
    // 상태
    loading,
    error,
    
    // 액션
    setCurrentPage,
    setSearch,
    setDateRange,
    refetch,
    
    // 계산된 값
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  };
}
