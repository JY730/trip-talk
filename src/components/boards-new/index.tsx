/**
 * Boards New Component
 * 게시글 등록 폼 컴포넌트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

'use client';

import React from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Textarea } from '@/commons/components/textarea';
import { Button } from '@/commons/components/button';
import useBoardForm from './hooks/index.form.hook';

export interface BoardsNewProps {
  /**
   * 추가 props가 필요한 경우 여기에 정의
   */
  [key: string]: unknown;
}

/**
 * 게시글 등록 컴포넌트
 * react-hook-form을 사용한 게시글 등록 폼
 * 
 * @example
 * <BoardsNew />
 */
export const BoardsNew = React.forwardRef<HTMLFormElement, BoardsNewProps>(
  (props, ref) => {
  const { form, isFormValid, onSubmit, onCancel } = useBoardForm();
  const { register, formState: { errors } } = form;

    return (
      <form ref={ref} onSubmit={onSubmit} className={styles.container} data-testid="board-form" {...props}>
      {/* Detail Title */}
      <div className={styles.submitTitle}>
        <h1 data-testid="board-form-title">게시글 등록</h1>
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
            className={styles.userInputContainer}
            {...register('writer')}
            error={!!errors.writer}
            errorMessage={errors.writer?.message}
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
            className={styles.passwordInputContainer}
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
          className={styles.titleInputContainer}
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
          className={styles.contentInputContainer}
          {...register('contents')}
          error={!!errors.contents}
          errorMessage={errors.contents?.message}
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
        <div className={styles.addressInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="주소"
            placeholder="주소를 입력해 주세요."
            className={styles.addressInputContainer}
            {...register('boardAddress')}
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
          className={styles.youtubeInputContainer}
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
            shape="rectangle"
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
            shape="rectangle"
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
  }
);

BoardsNew.displayName = 'BoardsNew';

export default BoardsNew;