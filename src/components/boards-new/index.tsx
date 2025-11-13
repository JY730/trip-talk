/**
 * Boards New Component
 * 게시글 등록 폼 컴포넌트
 * Design Source: Figma Node ID 285:33344
 * Last Updated: 2025-01-27
 */

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Textarea } from '@/commons/components/textarea';
import { Button } from '@/commons/components/button';
import useBoardForm from './hooks/index.form.hook';
import { useImageUpload } from './hooks/index.upload.hook';
import { useAddress } from './hooks/index.address.hook';
import DaumPostcode from 'react-daum-postcode';

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
  const { register, formState: { errors }, setValue } = form;
  const { uploadedUrls, previewUrls, handleImageUpload, handleImageDelete } = useImageUpload();
  const { 
    zipcode, 
    address, 
    addressDetail, 
    isModalOpen, 
    handleOpenModal, 
    handleCloseModal, 
    handleComplete, 
    handleAddressDetailChange 
  } = useAddress();
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [uploadingStates, setUploadingStates] = useState<boolean[]>(
    () => Array.from({ length: uploadedUrls.length }, () => false),
  );

  useEffect(() => {
    const filtered = uploadedUrls.filter((url) => url);
    form.setValue('images', filtered);
    void form.trigger('images');
  }, [uploadedUrls, form]);

  // 주소 값이 변경되면 form에 반영
  useEffect(() => {
    setValue('boardAddress', {
      zipcode,
      address,
      addressDetail,
    }, { shouldValidate: false });
  }, [zipcode, address, addressDetail, setValue]);

  // react-daum-postcode의 handleComplete를 래핑하여 form에 반영
  const handlePostcodeComplete = (data: any) => {
    handleComplete(data);
  };

  const handleSlotClick = (index: number) => {
    const input = fileInputRefs.current[index];
    input?.click();
  };

  const handleFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingStates((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    try {
      await handleImageUpload(index, file);
    } finally {
      event.target.value = '';
      setUploadingStates((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    handleImageDelete(index);
    setUploadingStates((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const filledCount = useMemo(
    () => uploadedUrls.filter((url) => url).length,
    [uploadedUrls],
  );

    return (
      <>
      <form
        ref={ref}
        onSubmit={onSubmit}
        className={styles.container}
        data-testid="board-upload-page"
        {...props}
      >
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
              onClick={handleOpenModal}
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
            onChange={handleAddressDetailChange}
            data-testid="address-detail-input"
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
        <div className={styles.imageUploadGrid} data-upload-count={filledCount}>
          {uploadedUrls.map((url, index) => {
            const isUploading = uploadingStates[index];
            const displayUrl = previewUrls[index] || url;
            const hasImage = Boolean(displayUrl);
            const slotClassName = [
              styles.imageUploadSlot,
              hasImage ? styles.imageUploadSlotFilled : styles.imageUploadSlotEmpty,
            ].join(' ');

            return (
              <div
                key={index}
                className={slotClassName}
                data-testid={`upload-slot-${index}`}
                onClick={() => !hasImage && handleSlotClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (!hasImage) {
                      handleSlotClick(index);
                    }
                  }
                }}
              >
                <input
                  ref={(element) => {
                    fileInputRefs.current[index] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  data-testid={`file-input-${index}`}
                  onChange={(event) => handleFileChange(index, event)}
                  tabIndex={-1}
                />

                {isUploading && (
                  <div className={styles.uploadingOverlay}>
                    <span className={styles.uploadingText}>업로드 중...</span>
                  </div>
                )}

                {hasImage ? (
                  <>
                    <img
                      src={displayUrl}
                      alt="업로드된 이미지 미리보기"
                      className={styles.previewImage}
                      data-testid={`preview-image-${index}`}
                    />
                    <button
                      type="button"
                      className={styles.deleteButton}
                      data-testid={`delete-image-${index}`}
                      aria-label="이미지 삭제"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteImage(index);
                      }}
                    >
                      <img src="/icons/close_w.svg" alt="이미지 삭제" />
                    </button>
                  </>
                ) : (
                  <>
                    <img src="/icons/add.svg" alt="이미지 추가" className={styles.addIcon} />
                    <span className={styles.addImageText}>클릭해서 사진 업로드</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <span className={styles.visuallyHidden} aria-hidden="true" data-testid="uploaded-url-count">
          {filledCount}
        </span>
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
);

BoardsNew.displayName = 'BoardsNew';

export default BoardsNew;