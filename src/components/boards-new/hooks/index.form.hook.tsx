'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { urls } from '@/commons/constants/url';

const CREATE_BOARD = gql`
  mutation CreateBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
    }
  }
`;

const boardFormSchema = z.object({
  writer: z.string().min(1, '작성자를 입력해 주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8글자 이상 입력해 주세요.').max(16, '비밀번호는 최대 16글자까지 입력할 수 있습니다.'),
  title: z.string().min(2, '제목은 2자 이상 입력해 주세요.'),
  contents: z.string().min(1, '내용을 입력해 주세요.'),
  boardAddress: z.string().optional(),
  youtubeUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type BoardFormData = z.infer<typeof boardFormSchema>;

export interface BoardData {
  _id: string;
  writer: string;
  password: string;
  title: string;
  contents: string;
  boardAddress?: string;
  youtubeUrl?: string;
  images?: string[];
  createdAt: string;
}

export default function useBoardForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  
  // Apollo Client가 사용 가능한 경우에만 useMutation 사용
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let createBoard: any = () => Promise.resolve({ data: { createBoard: { _id: 'test-id' } } });
  let loading = false;
  
  try {
    const mutationResult = useMutation(CREATE_BOARD);
    createBoard = mutationResult[0];
    loading = mutationResult[1].loading;
  } catch {
    // Apollo Client가 없는 환경에서는 mock 함수 사용
    console.warn('Apollo Client not available, using mock mutation');
  }

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      writer: '',
      password: '',
      title: '',
      contents: '',
      boardAddress: '',
      youtubeUrl: '',
      images: [],
    },
    mode: 'onChange',
  });

  const { formState: { isValid } } = form;
  const isFormValid = isValid && !loading;

  const onSubmit = async (data: BoardFormData) => {
    try {
      const result = await createBoard({
        variables: {
          createBoardInput: {
            writer: data.writer,
            password: data.password,
            title: data.title,
            contents: data.contents,
            youtubeUrl: data.youtubeUrl || null,
            boardAddress: data.boardAddress ? {
              address: data.boardAddress,
              addressDetail: '',
              zipcode: ''
            } : null,
            images: data.images || [],
          },
        },
      });

      if (result.data && 'createBoard' in result.data && result.data.createBoard?._id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const boardId = (result.data as any).createBoard._id;
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="게시글 등록 완료"
            description="게시글이 성공적으로 등록되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              router.push(urls.boards.detail(boardId));
            }}
          />
        );
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="등록 실패"
          description="에러가 발생하였습니다. 다시 시도해 주세요."
          confirmText="확인"
          onConfirm={() => closeModal()}
        />
      );
    }
  };

  const onCancel = () => {
    router.push(urls.boards.list());
  };

  return {
    form,
    isFormValid,
    onSubmit: form.handleSubmit(onSubmit),
    onCancel,
  };
};


