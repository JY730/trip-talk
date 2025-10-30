'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const FETCH_BOARD_COMMENTS = gql`
  query fetchBoardComments($boardId: ID!) {
    fetchBoardComments(boardId: $boardId) {
      _id
      writer
      contents
      rating
      createdAt
    }
  }
`;

export interface CommentItem {
  _id: string;
  writer: string;
  contents: string;
  rating?: number | null;
  createdAt: string;
}

interface FetchBoardCommentsResponse {
  fetchBoardComments: CommentItem[];
}

export interface UseCommentListReturn {
  comments: CommentItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export default function useCommentList(explicitBoardId?: string): UseCommentListReturn {
  const params = useParams();
  const boardIdFromParams = (params?.id as string | undefined) || undefined;
  const boardId = explicitBoardId || boardIdFromParams || '';

  const { data, loading, error, refetch } = useQuery<FetchBoardCommentsResponse>(
    FETCH_BOARD_COMMENTS,
    {
      variables: { boardId },
      skip: !boardId,
      errorPolicy: 'all',
    }
  );

  const sorted = useMemo(() => {
    const list = data?.fetchBoardComments ?? [];
    return [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime; // desc
    });
  }, [data]);

  return {
    comments: sorted,
    loading: loading || false,
    error: error || null,
    refetch: async () => {
      if (!boardId) return;
      await refetch({ boardId });
    },
  };
}


