'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import DaumPostcode from 'react-daum-postcode';
import styles from '../styles.module.css';
import { Input } from '@/commons/components/input';
import { Textarea } from '@/commons/components/textarea';
import { Button } from '@/commons/components/button';
import useBoardUpdateForm from '../hooks/index.update.hook';
import { useAddressEdit } from '../hooks/index.address-edit.hook';
import { useEditImageUpload } from '../hooks/index.upload-edit.hook';

const STORAGE_BASE_URL = 'https://storage.googleapis.com/';

/**
 * 이미지 URL 정규화 함수
 * Google Storage URL 및 상대 경로를 절대 URL로 변환
 */
const normalizeImageUrl = (source: string): string | null => {
  if (typeof source !== 'string') return null;

  const trimmed = source.trim();

  if (!trimmed) {
    return null;
  }

  const isAbsolute = /^https?:\/\//i.test(trimmed);
  if (isAbsolute) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  if (trimmed.toLowerCase().startsWith('storage.googleapis.com')) {
    return `https://${trimmed}`;
  }

  const sanitized = trimmed.replace(/^\/+/, '');
  return `${STORAGE_BASE_URL}${sanitized}`;
};

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

  // 이미지 업로드 hook 사용
  const {
    uploadedUrls,
    previewUrls,
    fetchExistingImages,
    handleImageUpload,
    handleImageDelete,
  } = useEditImageUpload(boardId || '');

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [uploadingStates, setUploadingStates] = useState<boolean[]>(
    () => Array.from({ length: 3 }, () => false),
  );
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [imageLoadingStates, setImageLoadingStates] = useState<Set<number>>(new Set());

  // 기존 이미지 불러오기
  useEffect(() => {
    if (boardId && !isInitializing) {
      void fetchExistingImages();
    }
  }, [boardId, isInitializing, fetchExistingImages]);

  // uploadedUrls가 변경되면 form에 반영
  useEffect(() => {
    const filtered = uploadedUrls.filter((url) => url);
    setValue('images', filtered, { shouldValidate: false });
    void form.trigger('images');

    // URL이 제거된 경우 에러 및 로딩 상태도 제거
    uploadedUrls.forEach((url, idx) => {
      if (!url) {
        setImageLoadErrors((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
        setImageLoadingStates((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }
    });
  }, [uploadedUrls, setValue, form]);

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
      data-testid="board-edit-page"
    >
      <div data-testid="board-update-form" style={{ display: 'contents' }}>
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
                data-testid={hasImage ? `image-slot-${index}` : `upload-slot-${index}`}
                onClick={(e) => {
                  // 이미지가 있을 때는 클릭해도 파일 선택창이 열리지 않도록
                  // 삭제 버튼 클릭은 이미 stopPropagation으로 처리됨
                  if (!hasImage) {
                    handleSlotClick(index);
                  }
                }}
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
                    {imageLoadErrors.has(index) ? (
                      <div className={styles.imageErrorPlaceholder}>
                        <img src="/icons/add.svg" alt="이미지 로드 실패" className={styles.addIcon} />
                        <span className={styles.addImageText}>이미지를 불러올 수 없습니다</span>
                      </div>
                    ) : (
                      <>
                        {imageLoadingStates.has(index) && (
                          <div className={styles.imageLoadingOverlay}>
                            <span className={styles.uploadingText}>로딩 중...</span>
                          </div>
                        )}
                        <img
                          src={displayUrl.startsWith('blob:') ? displayUrl : (normalizeImageUrl(displayUrl) || displayUrl)}
                          alt="업로드된 이미지 미리보기"
                          className={styles.previewImage}
                          data-testid={`preview-image-${index}`}
                          onLoadStart={() => {
                            // blob URL이 아닌 경우에만 로딩 상태 설정 (서버에서 이미지 로드)
                            if (!displayUrl.startsWith('blob:')) {
                              setImageLoadingStates((prev) => {
                                const next = new Set(prev);
                                next.add(index);
                                return next;
                              });
                            }
                          }}
                          onLoad={() => {
                            setImageLoadingStates((prev) => {
                              const next = new Set(prev);
                              next.delete(index);
                              return next;
                            });
                            setImageLoadErrors((prev) => {
                              const next = new Set(prev);
                              next.delete(index);
                              return next;
                            });
                          }}
                          onError={(e) => {
                            setImageLoadingStates((prev) => {
                              const next = new Set(prev);
                              next.delete(index);
                              return next;
                            });
                            setImageLoadErrors((prev) => {
                              const next = new Set(prev);
                              next.add(index);
                              return next;
                            });
                            // 이미지 로드 실패 시 빈 이미지로 표시하지 않고 에러 상태 유지
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </>
                    )}
                    <button
                      type="button"
                      className={styles.deleteButton}
                      data-testid={`delete-image-${index}`}
                      aria-label="이미지 삭제"
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        handleDeleteImage(index);
                        setImageLoadErrors((prev) => {
                          const next = new Set(prev);
                          next.delete(index);
                          return next;
                        });
                        setImageLoadingStates((prev) => {
                          const next = new Set(prev);
                          next.delete(index);
                          return next;
                        });
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
      </div>
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


