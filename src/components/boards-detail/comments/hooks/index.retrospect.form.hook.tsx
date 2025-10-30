'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';

// Form 스키마 정의
const commentSchema = z.object({
  writer: z.string().min(1, '작성자를 입력해 주세요.'),
  password: z
    .string()
    .length(4, '비밀번호는 4자리여야 합니다.'),
  contents: z
    .string()
    .min(2, '댓글은 2자 이상 입력해 주세요.'),
  rating: z.number().optional().default(0),
});

export type CommentFormValues = z.infer<typeof commentSchema>;

// GraphQL Mutation 정의
const CREATE_BOARD_COMMENT = gql`
  mutation createBoardComment(
    $boardId: ID!
    $createBoardCommentInput: CreateBoardCommentInput!
  ) {
    createBoardComment(
      boardId: $boardId
      createBoardCommentInput: $createBoardCommentInput
    ) {
      _id
      writer
      contents
      rating
      createdAt
    }
  }
`;

export interface UseCommentFormParams {
  boardId?: string;
}

export interface UseCommentFormReturn {
  register: ReturnType<typeof useForm<CommentFormValues>>['register'];
  handleSubmit: ReturnType<typeof useForm<CommentFormValues>>['handleSubmit'];
  formState: ReturnType<typeof useForm<CommentFormValues>>['formState'];
  onSubmit: (values: CommentFormValues) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useCommentForm(params?: UseCommentFormParams): UseCommentFormReturn {
  const boardId = params?.boardId;
  const { openModal, closeModal } = useModal();
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    mode: 'onChange',
    defaultValues: {
      writer: '',
      password: '',
      contents: '',
      rating: 0,
    },
  });

  const [createBoardComment, { loading }] = useMutation(CREATE_BOARD_COMMENT);

  const successModal = useMemo(
    () => (
      <Modal
        variant="info"
        actions="single"
        title="댓글이 등록되었습니다."
        confirmText="확인"
        onConfirm={() => {
          closeModal();
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    ),
    [closeModal]
  );

  const failureModal = useMemo(
    () => (
      <Modal
        variant="danger"
        actions="single"
        title="에러가 발생하였습니다. 다시 시도해 주세요."
        confirmText="확인"
        onConfirm={() => {
          closeModal();
        }}
      />
    ),
    [closeModal]
  );

  const onSubmit = useCallback(
    async (values: CommentFormValues) => {
      setError(null);
      try {
        const validation = commentSchema.safeParse(values);
        if (!validation.success) {
          throw new Error(
            validation.error.issues?.[0]?.message || '유효성 검사에 실패했습니다.'
          );
        }
        if (!boardId) {
          throw new Error('boardId가 없습니다.');
        }

        const { data } = await createBoardComment({
          variables: {
            boardId,
            createBoardCommentInput: {
              writer: values.writer,
              password: values.password,
              contents: values.contents,
              rating: values.rating ?? 0,
            },
          },
        });

        const createdId = data?.createBoardComment?._id;
        if (!createdId) {
          throw new Error('응답에 _id가 없습니다.');
        }

        openModal(successModal);
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Unknown error');
        setError(err);
        openModal(failureModal);
      }
    },
    [boardId, createBoardComment, openModal, successModal, failureModal]
  );

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    formState: form.formState,
    onSubmit,
    loading,
    error,
  };
}

export default useCommentForm;


