'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';

/**
 * GraphQL Query: fetchBoard
 */
const FETCH_BOARD = gql`
  query FetchBoard($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id
      writer
      title
      contents
      youtubeUrl
      likeCount
      dislikeCount
      images
      boardAddress {
        address
        addressDetail
        zipcode
      }
      user {
        _id
        email
        name
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

/**
 * BoardAddress 타입 정의
 */
export interface BoardAddress {
  address?: string;
  addressDetail?: string;
  zipcode?: string;
}

/**
 * User 타입 정의
 */
export interface User {
  _id?: string;
  email?: string;
  name?: string;
}

/**
 * FetchBoard 응답 데이터 타입 정의
 */
export interface FetchBoardResponse {
  _id: string;
  writer?: string;
  title: string;
  contents: string;
  youtubeUrl?: string;
  likeCount: number;
  dislikeCount: number;
  images?: string[];
  boardAddress?: BoardAddress;
  user?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * FetchBoard Query 응답 타입
 */
interface FetchBoardQueryData {
  fetchBoard: FetchBoardResponse;
}

/**
 * useBoardDetail 훅 반환 타입
 */
export interface UseBoardDetailReturn {
  data: FetchBoardResponse | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useBoardDetail 훅
 * 게시글 상세 정보를 조회하는 훅
 * 
 * @returns {UseBoardDetailReturn} 게시글 데이터, 로딩 상태, 에러 상태
 */
export default function useBoardDetail(): UseBoardDetailReturn {
  // 1. Next.js router에서 boardId 추출
  const params = useParams();
  const boardId = params?.id as string | undefined;

  // 2. Apollo Client로 fetchBoard 요청
  const { data, loading, error } = useQuery<FetchBoardQueryData>(FETCH_BOARD, {
    variables: {
      boardId: boardId || '',
    },
    skip: !boardId, // boardId가 없으면 쿼리 실행하지 않음
    errorPolicy: 'all', // 에러 발생 시에도 데이터 반환
  });

  // 3. 로딩, 에러, 데이터 상태 관리
  // 4. fetchBoard의 데이터 반환
  return {
    data: data?.fetchBoard || null,
    loading: loading || false,
    error: error || null,
  };
}
