'use client';

import { useCallback, useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { ApolloError, ApolloQueryResult } from '@apollo/client';

const FETCH_BOARDS_OF_THE_BEST = gql`
  query FetchBoardsOfTheBest {
    fetchBoardsOfTheBest {
      _id
      writer
      title
      images
      likeCount
      createdAt
    }
  }
`;

export interface BestBoardItem {
  _id: string;
  writer: string;
  title: string;
  images: string[] | null;
  likeCount: number;
  createdAt: string;
}

interface FetchBoardsOfTheBestResponse {
  fetchBoardsOfTheBest: BestBoardItem[];
}

export interface UseBestBoardsBindingResult {
  bestBoards: BestBoardItem[];
  loading: boolean;
  errorMessage: string | null;
  refetch: () => Promise<ApolloQueryResult<FetchBoardsOfTheBestResponse>>;
}

const DEFAULT_ERROR_MESSAGE = '베스트 게시글을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.';

export default function useBestBoardsBinding(): UseBestBoardsBindingResult {
  const [bestBoards, setBestBoards] = useState<BestBoardItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<FetchBoardsOfTheBestResponse>(FETCH_BOARDS_OF_THE_BEST, {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  useEffect(() => {
    try {
      if (error) {
        throw error;
      }

      if (data?.fetchBoardsOfTheBest) {
        setBestBoards(data.fetchBoardsOfTheBest);
        setErrorMessage(null);
      }
    } catch (caughtError) {
      const apolloError = caughtError as ApolloError;
      console.error('Best boards fetch error:', apolloError);

      setBestBoards([]);
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
    }
  }, [data, error]);

  const handleRefetch = useCallback(async () => {
    try {
      const result = await refetch();
      setErrorMessage(null);

      return result;
    } catch (caughtError) {
      const apolloError = caughtError as ApolloError;
      console.error('Best boards refetch error:', apolloError);
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
      throw apolloError;
    }
  }, [refetch]);

  return {
    bestBoards,
    loading,
    errorMessage,
    refetch: handleRefetch,
  };
}

