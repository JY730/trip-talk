'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

/**
 * GraphQL 쿼리 정의
 */
const FETCH_BOARDS = gql`
  query FetchBoards {
    fetchBoards {
      _id
      title
      writer
      createdAt
    }
  }
`;

const FETCH_BOARDS_COUNT = gql`
  query FetchBoardsCount {
    fetchBoardsCount
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
 * 커스텀 훅의 반환 타입
 */
export interface UseBoardsBindingReturn {
  boards: BoardItem[];
  totalCount: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 게시글 목록 조회 커스텀 훅
 * Apollo Client의 useQuery를 사용하여 게시글 데이터를 조회합니다.
 * 
 * @returns {UseBoardsBindingReturn} 게시글 목록, 총 개수, 로딩 상태, 에러 상태, refetch 함수
 */
export default function useBoardsBinding(): UseBoardsBindingReturn {
  // 게시글 목록 조회
  const {
    data: boardsData,
    loading: boardsLoading,
    error: boardsError,
    refetch: refetchBoards,
  } = useQuery<FetchBoardsResponse>(FETCH_BOARDS, {
    errorPolicy: 'all',
  });

  // 게시글 개수 조회
  const {
    data: countData,
    loading: countLoading,
    error: countError,
    refetch: refetchCount,
  } = useQuery<FetchBoardsCountResponse>(FETCH_BOARDS_COUNT, {
    errorPolicy: 'all',
  });

  // refetch 함수
  const refetch = () => {
    refetchBoards();
    refetchCount();
  };

  return {
    boards: boardsData?.fetchBoards || [],
    totalCount: countData?.fetchBoardsCount || 0,
    loading: boardsLoading || countLoading,
    error: boardsError || countError || null,
    refetch,
  };
}
