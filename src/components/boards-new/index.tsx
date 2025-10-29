/**
 * Boards New Component
 * 게시글 등록 폼 컴포넌트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useModal } from '../../commons/providers/modal/modal.provider';
import { Modal } from '../../commons/components/modal';
import styles from './styles.module.css';
import { Input } from '../../commons/components/input';
import { Textarea } from '../../commons/components/textarea';
import { Button } from '../../commons/components/button';

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

type BoardFormData = z.infer<typeof boardFormSchema>;

interface BoardData {
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

/**
 * 게시글 등록 컴포넌트
 * react-hook-form을 사용한 게시글 등록 폼
 * 
 * @example
 * <BoardsNew />
 */
const BoardsNew = () => {
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
      
      openModal(
        <Modal
          variant="info"
          actions="single"
          title="게시글 등록 완료"
          description="게시글이 성공적으로 등록되었습니다."
          confirmText="확인"
          onConfirm={() => {
            closeModal();
            router.push(`/boards/${newId}`);
          }}
        />
      );
    } catch (error) {
      console.error('Failed to submit form:', error);
      
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="등록 실패"
          description="게시글 등록 중 오류가 발생했습니다. 다시 시도해 주세요."
          confirmText="확인"
          onConfirm={() => closeModal()}
        />
      );
    }
  };

  const onCancel = () => {
    router.back();
  };
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.container}>      
      {/* Detail Title */}
      <div className={styles.submitTitle}>
        <h1>게시글 등록</h1>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input User */}
      <div className={styles.inputUser}>
        <div className={styles.userInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="작성자"
            placeholder="작성자를 입력해 주세요."
            required
            containerClassName={styles.userInputContainer}
            {...register('author')}
            error={!!errors.author}
            errorMessage={errors.author?.message}
          />
        </div>
        <div className={styles.passwordInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="비밀번호"
            placeholder="비밀번호를 입력해 주세요."
            type="password"
            required
            containerClassName={styles.passwordInputContainer}
            {...register('password')}
            error={!!errors.password}
            errorMessage={errors.password?.message}
          />
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Title */}
      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="제목"
          placeholder="제목을 입력해 주세요."
          required
          containerClassName={styles.titleInputContainer}
          {...register('title')}
          error={!!errors.title}
          errorMessage={errors.title?.message}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Content */}
      <div className={styles.inputContent}>
        <Textarea
          label="내용"
          placeholder="내용을 입력해 주세요."
          required
          containerClassName={styles.contentInputContainer}
          {...register('content')}
          error={!!errors.content}
          errorMessage={errors.content?.message}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input Address */}
      <div className={styles.inputAddress}>
        <div className={styles.postcodeWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="주소"
            placeholder="01234"
            containerClassName={styles.postcodeInputContainer}
            {...register('postcode')}
            rightButton={
              <Button
                variant="secondary"
                styleType="outline"
                size="large"
                shape='rectangle'
                className={styles.postcodeSearchButton}
                type="button"
              >
                우편번호 검색
              </Button>
            }
          />
        </div>
        <div className={styles.addressInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="주소를 입력해 주세요."
            containerClassName={styles.addressInputContainer}
            {...register('address')}
          />
        </div>
        <div className={styles.detailAddressWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="상세주소"
            containerClassName={styles.detailAddressInputContainer}
            {...register('detailAddress')}
          />
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Input YouTube URL */}
      <div className={styles.inputYoutubeUrl}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="유튜브 링크"
          placeholder="링크를 입력해 주세요."
          containerClassName={styles.youtubeInputContainer}
          {...register('youtubeUrl')}
        />
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Divider */}
      <div className={styles.divider}></div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Add Image Button */}
      <div className={styles.addImageSection}>
        <div className={styles.imageUploadLabel}>
          <span className={styles.imageLabel}>사진 첨부</span>
        </div>
        <div className={styles.imageUploadGrid}>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
          <div className={styles.imageUploadSlot}>
            <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
            <span className={styles.addImageText}>클릭해서 사진 업로드</span>
          </div>
        </div>
      </div>
      
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Submit Button */}
      <div className={styles.button}>
        <div className={styles.buttonWrapper}>
          <Button
            variant="secondary"
            styleType="outline"
            size="large"
            shape='rectangle'
            className={styles.cancelButton}
            type="button"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            variant="primary"
            styleType="filled"
            size="large"
            shape='rectangle'
            className={styles.submitButton}
            type="submit"
            disabled={!isFormValid}
          >
            등록하기
          </Button>
        </div>
      </div>

      <div className={styles.gap}></div>
    </form>
  );
};

export default BoardsNew;