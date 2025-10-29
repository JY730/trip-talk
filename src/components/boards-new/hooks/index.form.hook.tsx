'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useModal } from '../../../commons/providers/modal/modal.provider';

const boardFormSchema = z.object({
  author: z.string().min(1, '작성자를 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
  title: z.string().min(1, '제목을 입력해 주세요.'),
  content: z.string().min(1, '내용을 입력해 주세요.'),
  postcode: z.string().optional(),
  address: z.string().optional(),
  detailAddress: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

export type BoardFormData = z.infer<typeof boardFormSchema>;

export interface BoardData {
  id: string;
  author: string;
  password: string;
  title: string;
  content: string;
  postcode?: string;
  address?: string;
  detailAddress?: string;
  youtubeUrl?: string;
  createdAt: string;
}

export default function useBoardForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      author: '',
      password: '',
      title: '',
      content: '',
      postcode: '',
      address: '',
      detailAddress: '',
      youtubeUrl: '',
    },
    mode: 'onChange',
  });

  const { formState: { isValid } } = form;
  const isFormValid = isValid;

  const getBoardsFromStorage = (): BoardData[] => {
    try {
      const stored = localStorage.getItem('boards');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get boards from storage:', error);
      return [];
    }
  };

  const saveBoardsToStorage = (boards: BoardData[]): void => {
    try {
      localStorage.setItem('boards', JSON.stringify(boards));
    } catch (error) {
      console.error('Failed to save boards to storage:', error);
    }
  };

  const onSubmit = (data: BoardFormData) => {
    try {
      const existingBoards = getBoardsFromStorage();
      
      const maxId = existingBoards.length > 0 
        ? Math.max(...existingBoards.map(board => parseInt(board.id) || 0))
        : 0;
      const newId = (maxId + 1).toString();
      
      const newBoard: BoardData = {
        id: newId,
        ...data,
        createdAt: new Date().toISOString(),
      };
      
      const updatedBoards = [...existingBoards, newBoard];
      saveBoardsToStorage(updatedBoards);
      
      openModal({
        variant: 'success',
        title: '게시글 등록 완료',
        content: '게시글이 성공적으로 등록되었습니다.',
        actions: [
          {
            label: '확인',
            onClick: () => {
              closeModal();
              router.push(`/boards/${newId}`);
            },
          },
        ],
      });
    } catch (error) {
      console.error('Failed to submit form:', error);
      
      openModal({
        variant: 'error',
        title: '등록 실패',
        content: '게시글 등록 중 오류가 발생했습니다. 다시 시도해 주세요.',
        actions: [
          {
            label: '확인',
            onClick: () => closeModal(),
          },
        ],
      });
    }
  };

  const onCancel = () => {
    router.back();
  };

  return {
    form,
    isFormValid,
    onSubmit: form.handleSubmit(onSubmit),
    onCancel,
  };
};


