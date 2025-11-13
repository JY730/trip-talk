'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '../styles.module.css';
import { Input } from '@/commons/components/input';
import { Textarea } from '@/commons/components/textarea';
import { Button } from '@/commons/components/button';
import useBoardUpdateForm from '../hooks/index.update.hook';
import { useAddressEdit } from '../hooks/index.address-edit.hook';
import DaumPostcode from 'react-daum-postcode';

/**
 * Boards Update Component
 * 게시글 수정 폼 컴포넌트
 * Design Source: Figma Node IDs 285:32385 (수정전) → 898:16329 (수정중)
 */
export default function BoardsUpdate() {
  const params = useParams();
  const boardId = params?.id as string | undefined;
  
  const {
    form,
    isSubmitEnabled,
    isInitializing,
    isSubmitting,
    onSubmit,
    onCancel,
    errorMessage,
  } = useBoardUpdateForm();

  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  // 주소 편집 hook 사용
  const {
    zipcode,
    address,
    addressDetail,
    isModalOpen,
    handleAddressSearch,
    handleAddressChange,
    handleComplete,
    handleCloseModal,
  } = useAddressEdit(boardId || '');

  // 주소 값이 변경되면 form에 반영
  useEffect(() => {
    if (boardId) {
      setValue('boardAddress', {
        zipcode,
        address,
        addressDetail,
      }, { shouldValidate: false });
    }
  }, [zipcode, address, addressDetail, setValue, boardId]);

  // react-daum-postcode의 handleComplete를 래핑
  const handlePostcodeComplete = (data: any) => {
    handleComplete(data);
  };

  if (isInitializing) {
    return (
      <div className={styles.container} data-testid="board-update-loading">
        <div className={styles.submitTitle}>
          <h1 data-testid="board-update-form-title">게시글 수정</h1>
        </div>
        <div className={styles.gap}></div>
        <div>게시글 정보를 불러오는 중입니다…</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.container} data-testid="board-update-error">
        <div className={styles.submitTitle}>
          <h1 data-testid="board-update-form-title">게시글 수정</h1>
        </div>
        <div className={styles.gap}></div>
        <div>{errorMessage}</div>
        <div className={styles.gap}></div>
        <Button
          variant="secondary"
          styleType="outline"
          size="large"
          shape="rectangle"
          onClick={onCancel}
        >
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
    <form
      onSubmit={onSubmit}
      className={styles.container}
      data-testid="board-update-form"
    >
      <div className={styles.submitTitle}>
        <h1 data-testid="board-update-form-title">게시글 수정</h1>
        <span className={styles.editBadge} data-testid="board-update-status">수정중</span>
      </div>

      <div className={styles.gap}></div>

      <div className={styles.inputUser}>
        <div className={styles.userInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="작성자"
            placeholder="작성자를 불러오는 중입니다."
            disabled
            className={styles.userInputContainer}
            data-testid="board-update-writer"
            {...register('writer')}
          />
        </div>
        <div className={styles.passwordInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            label="비밀번호"
            placeholder="비밀번호는 수정할 수 없습니다."
            type="password"
            disabled
            className={styles.passwordInputContainer}
            data-testid="board-update-password"
          />
        </div>
      </div>

      <div className={styles.gap}></div>
      <div className={styles.divider}></div>
      <div className={styles.gap}></div>

      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="제목"
          placeholder="제목을 입력해 주세요."
          required
          className={styles.titleInputContainer}
          data-testid="board-update-title"
          {...register('title')}
          error={!!errors.title}
          errorMessage={errors.title?.message}
        />
      </div>

      <div className={styles.gap}></div>
      <div className={styles.divider}></div>
      <div className={styles.gap}></div>

      <div className={styles.inputContent}>
        <Textarea
          label="내용"
          placeholder="내용을 입력해 주세요."
          required
          className={styles.contentInputContainer}
          data-testid="board-update-contents"
          {...register('contents')}
          error={!!errors.contents}
          errorMessage={errors.contents?.message}
        />
      </div>

      <div className={styles.gap}></div>
      <div className={styles.divider}></div>
      <div className={styles.gap}></div>

      {/* Input Address */}
      <div className={styles.inputAddress}>
        <div className={styles.postcodeRow}>
          <div className={styles.postcodeWrapper}>
            <Input
              variant="primary"
              theme="light"
              size="large"
              label="주소"
              placeholder="01234"
              className={styles.postcodeInputContainer}
              value={zipcode}
              readOnly
              data-testid="zipcode-input"
            />
          </div>
          <div className={styles.postcodeSearchButton}>
            <Button
              variant="secondary"
              styleType="outline"
              size="large"
              shape="rectangle"
              type="button"
              onClick={handleAddressSearch}
              data-testid="zipcode-button"
            >
              우편번호 검색
            </Button>
          </div>
        </div>
        <div className={styles.addressInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="주소를 입력해 주세요."
            className={styles.addressInputContainer}
            value={address}
            readOnly
            data-testid="address-input"
          />
        </div>
        <div className={styles.detailAddressWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="large"
            placeholder="상세 주소를 입력해 주세요."
            className={styles.detailAddressInputContainer}
            value={addressDetail}
            onChange={handleAddressChange}
            data-testid="address-detail-input"
          />
        </div>
      </div>

      <div className={styles.gap}></div>
      <div className={styles.divider}></div>
      <div className={styles.gap}></div>

      <div className={styles.inputYoutubeUrl}>
        <Input
          variant="primary"
          theme="light"
          size="large"
          label="유튜브 링크"
          placeholder="링크를 입력해 주세요."
          className={styles.youtubeInputContainer}
          data-testid="board-update-youtube"
          {...register('youtubeUrl')}
          error={!!errors.youtubeUrl}
          errorMessage={errors.youtubeUrl?.message}
        />
      </div>

      <div className={styles.gap}></div>
      <div className={styles.divider}></div>
      <div className={styles.gap}></div>

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

      <div className={styles.gap}></div>

      <div className={styles.button}>
        <div className={styles.buttonWrapper}>
          <Button
            variant="secondary"
            styleType="outline"
            size="large"
            shape="rectangle"
            className={styles.cancelButton}
            type="button"
            data-testid="board-update-cancel"
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
            data-testid="board-update-submit"
            disabled={!isSubmitEnabled || isSubmitting}
          >
            {isSubmitting ? '수정 중…' : '수정하기'}
          </Button>
        </div>
      </div>

      <div className={styles.gap}></div>
    </form>
    
    {/* Postcode Modal */}
    {isModalOpen && (
      <div className={styles.postcodeModalOverlay} onClick={handleCloseModal} data-testid="postcode-modal-overlay">
        <div className={styles.postcodeModal} onClick={(e) => e.stopPropagation()} data-testid="postcode-modal">
          <button
            type="button"
            className={styles.postcodeModalClose}
            onClick={handleCloseModal}
            aria-label="닫기"
          >
            <img src="/icons/close_w.svg" alt="닫기" />
          </button>
          <DaumPostcode
            onComplete={handlePostcodeComplete}
            autoClose={false}
          />
        </div>
      </div>
    )}
    </>
  );
}


