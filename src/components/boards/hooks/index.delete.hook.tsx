'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import type { ApolloError } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { useAuthActionGuard } from '@/commons/providers/auth/auth.guard.hook';
import { useAuth } from '@/commons/providers/auth/auth.provider';

const DELETE_BOARD = gql`
  mutation DeleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

export interface UseBoardDeleteOptions {
  onReload?: () => Promise<void> | void;
}

export interface UseBoardDeleteReturn {
  onDelete: (boardId: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
  canDelete: boolean;
  pendingBoardId: string | null;
}

const isPromise = (value: unknown): value is Promise<unknown> => {
  if (!value) return false;
  return typeof (value as Promise<unknown>).then === 'function';
};

export function useBoardDelete(options: UseBoardDeleteOptions = {}): UseBoardDeleteReturn {
  const { onReload } = options;
  const { guard } = useAuthActionGuard();
  const { isLoggedIn } = useAuth();
  const { openModal, closeModal } = useModal();

  const [pendingBoardId, setPendingBoardId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);

  const [deleteBoardMutation, { loading, error }] = useMutation(DELETE_BOARD, {
    errorPolicy: 'all',
  });

  const showErrorModal = useCallback(
    (message?: string) => {
      const finalMessage = message?.trim() ? message.trim() : '게시글 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      setLastError(new Error(finalMessage));
      setTimeout(() => {
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="게시글 삭제 실패"
            description={finalMessage}
            confirmText="확인"
            onConfirm={() => closeModal()}
            confirmButtonProps={{ 'data-testid': 'board-delete-error-confirm' }}
          />
        );
      }, 0);
    },
    [closeModal, openModal]
  );

  const confirmAndDelete = useCallback(
    async (boardId: string) => {
      setPendingBoardId(boardId);

      await new Promise<void>((resolve) => {
        const handleCancel = () => {
          closeModal();
          setPendingBoardId(null);
          resolve();
        };

        const handleConfirm = async () => {
          try {
            const result = await deleteBoardMutation({
              variables: { boardId },
            });

            closeModal();
            setPendingBoardId(null);
            const mutationError = result.error as ApolloError | undefined;
            if (mutationError) {
              showErrorModal(mutationError.message);
              return;
            }

            const graphQLErrors = (result.errors ?? []) as ApolloError['graphQLErrors'];
            if (Array.isArray(graphQLErrors) && graphQLErrors.length > 0) {
              const primaryMessage = graphQLErrors[0]?.message;
              showErrorModal(primaryMessage);
              return;
            }

            setLastError(null);

            const maybeReload = onReload?.();
            if (isPromise(maybeReload)) {
              await maybeReload;
            }
          } catch (caught) {
            closeModal();
            setPendingBoardId(null);
            const errorMessage = caught instanceof Error ? caught.message : '네트워크 오류가 발생했습니다.';
            showErrorModal(errorMessage);
          } finally {
            resolve();
          }
        };

        openModal(
          <Modal
            variant="info"
            actions="dual"
            title="게시글을 삭제 하시겠어요?"
            description="삭제된 게시글은 복구할 수 없습니다."
            confirmText="삭제"
            cancelText="취소"
            onConfirm={() => void handleConfirm()}
            onCancel={handleCancel}
            confirmButtonProps={{ 'data-testid': `board-delete-confirm-${boardId}` }}
            cancelButtonProps={{ 'data-testid': `board-delete-cancel-${boardId}` }}
          />
        );
      });
    },
    [closeModal, deleteBoardMutation, onReload, openModal, showErrorModal]
  );

  const onDelete = useMemo(
    () =>
      guard(async (boardId: string) => {
        await confirmAndDelete(boardId);
      }),
    [confirmAndDelete, guard]
  );

  const combinedError = lastError ?? (error ? new Error(error.message) : null);

  return {
    onDelete,
    loading,
    error: combinedError ?? null,
    canDelete: isLoggedIn,
    pendingBoardId,
  };
}

export default useBoardDelete;
