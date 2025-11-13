/**
 * Image Upload Edit Hook
 * 게시글 수정 시 이미지 업로드 및 관리 기능을 제공하는 커스텀 훅
 * 기존 이미지 조회, 이미지 업로드, 삭제, 게시글 수정 기능 포함
 * Last Updated: 2025-01-27
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useLazyQuery } from '@apollo/client/react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_UPLOAD_SLOTS = 3;

interface UploadFileResponse {
  uploadFile?: {
    url?: string;
  } | null;
}

interface UploadFileVariables {
  file: File;
}

interface FetchBoardResponse {
  fetchBoard?: {
    _id: string;
    images?: string[] | null;
  } | null;
}

interface UpdateBoardResponse {
  updateBoard?: {
    _id: string;
    images?: string[] | null;
  } | null;
}

interface UpdateBoardVariables {
  boardId: string;
  updateBoardInput: {
    images?: string[] | null;
    [key: string]: unknown;
  };
}

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

const FETCH_BOARD = gql`
  query FetchBoard($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id
      images
    }
  }
`;

const UPDATE_BOARD = gql`
  mutation UpdateBoard($boardId: ID!, $updateBoardInput: UpdateBoardInput!) {
    updateBoard(boardId: $boardId, updateBoardInput: $updateBoardInput) {
      _id
      images
    }
  }
`;

export interface UseEditImageUploadResult {
  uploadedUrls: string[];
  previewUrls: string[];
  fetchExistingImages: () => Promise<void>;
  handleImageUpload: (index: number, file: File) => Promise<void>;
  handleImageDelete: (index: number) => void;
  /**
   * 게시글 수정 함수
   * @note 실제로는 useBoardUpdateForm의 onSubmit에서 updateBoard를 처리하므로,
   *       이미지는 form.setValue로 form에 반영되어 자동으로 처리됩니다.
   *       이 함수는 프롬프트 요구사항에 따라 인터페이스에 포함되어 있으나,
   *       현재 구현에서는 사용되지 않습니다.
   */
  handleBoardUpdate: (updateBoardInput: any) => Promise<void>;
}

export const useEditImageUpload = (boardId: string): UseEditImageUploadResult => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(
    Array.from({ length: MAX_UPLOAD_SLOTS }, () => ''),
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    Array.from({ length: MAX_UPLOAD_SLOTS }, () => ''),
  );
  const uploadedUrlsRef = useRef(uploadedUrls);
  
  // uploadedUrls가 변경될 때마다 ref 업데이트
  useEffect(() => {
    uploadedUrlsRef.current = uploadedUrls;
  }, [uploadedUrls]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mutateUpload: any = async () => {
    throw new Error('Apollo Client is not initialized');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mutateUpdateBoard: any = async () => {
    throw new Error('Apollo Client is not initialized');
  };

  try {
    const [mutation] = useMutation<UploadFileResponse, UploadFileVariables>(UPLOAD_FILE, {
      context: {
        fetchOptions: {
          useUpload: true,
        },
      },
    });
    mutateUpload = mutation;
  } catch {
    console.warn('Apollo Client not available for uploadFile, using fallback handler');
  }

  try {
    const [updateMutation] = useMutation<UpdateBoardResponse, UpdateBoardVariables>(UPDATE_BOARD);
    mutateUpdateBoard = updateMutation;
  } catch {
    console.warn('Apollo Client not available for updateBoard, using fallback handler');
  }

  const [fetchBoard, { loading: isFetching }] = useLazyQuery<FetchBoardResponse>(FETCH_BOARD);

  const fetchExistingImages = useCallback(async () => {
    if (!boardId) {
      console.warn('fetchExistingImages: boardId is required');
      return;
    }

    try {
      const result = await fetchBoard({
        variables: {
          boardId,
        },
      });

      const images = result.data?.fetchBoard?.images;
      if (images && images.length > 0) {
        const initialUrls = [...images];
        while (initialUrls.length < MAX_UPLOAD_SLOTS) {
          initialUrls.push('');
        }
        setUploadedUrls(initialUrls.slice(0, MAX_UPLOAD_SLOTS));
      } else {
        setUploadedUrls(Array.from({ length: MAX_UPLOAD_SLOTS }, () => ''));
      }
    } catch (error) {
      console.error('기존 이미지 조회 실패:', error);
    }
  }, [boardId, fetchBoard]);

  const revokePreviewUrl = useCallback((url?: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleImageUpload = useCallback(
    async (index: number, file: File) => {
      if (!(file instanceof File)) {
        console.error('handleImageUpload: Provided value is not a File instance');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        window.alert('이미지 용량은 최대 5MB까지 가능합니다.');
        return;
      }

      if (index < 0 || index >= MAX_UPLOAD_SLOTS) {
        console.error(`handleImageUpload: Invalid index ${index}`);
        return;
      }

      const temporaryPreviewUrl = URL.createObjectURL(file);
      
      // uploadedUrls를 기준으로 빈 슬롯 찾기
      // 클릭한 index가 이미 사용 중이면, 해당 슬롯을 교체 (기존 이미지 삭제)
      const currentUrls = uploadedUrlsRef.current;
      let targetIndex = index;
      
      // 클릭한 index가 비어있으면 그 index 사용
      if (!currentUrls[index]) {
        targetIndex = index;
      } else {
        // 클릭한 index가 이미 사용 중이면, 해당 슬롯을 교체
        // 기존 이미지 URL을 revoke하고 새 이미지로 교체
        revokePreviewUrl(currentUrls[targetIndex]);
        targetIndex = index;
      }

      // 미리보기 URL 설정
      setPreviewUrls((prev) => {
        const next = [...prev];
        revokePreviewUrl(next[targetIndex]);
        next[targetIndex] = temporaryPreviewUrl;
        return next;
      });

      try {
        const result = await mutateUpload({
          variables: {
            file,
          },
        });

        const url = result?.data?.uploadFile?.url;
        if (!url) {
          throw new Error('uploadFile mutation did not return a URL');
        }

        setUploadedUrls((prev) => {
          const next = [...prev];
          next[targetIndex] = url;
          return next;
        });

        // index.upload.hook.ts와 동일하게 업로드 완료 후에도 previewUrls 유지
        // displayUrl = previewUrls[index] || url 이므로 previewUrls가 있으면 그것을 사용
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        window.alert('이미지 업로드에 실패했습니다.');
        setPreviewUrls((prev) => {
          const next = [...prev];
          if (next[targetIndex] === temporaryPreviewUrl) {
            revokePreviewUrl(next[targetIndex]);
            next.splice(targetIndex, 1);
            next.push('');
          }
          return next;
        });
        setUploadedUrls((prev) => {
          const next = [...prev];
          next.splice(targetIndex, 1);
          next.push('');
          return next;
        });
        revokePreviewUrl(temporaryPreviewUrl);
      }
    },
    [mutateUpload, revokePreviewUrl],
  );

  const handleImageDelete = useCallback((index: number) => {
    if (index < 0 || index >= MAX_UPLOAD_SLOTS) {
      console.error(`handleImageDelete: Invalid index ${index}`);
      return;
    }

    setUploadedUrls((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      next.push('');
      return next;
    });

    setPreviewUrls((prev) => {
      const next = [...prev];
      const removedPreview = next[index];
      revokePreviewUrl(removedPreview);
      next.splice(index, 1);
      next.push('');
      return next;
    });
  }, []);

  const handleBoardUpdate = useCallback(
    async (updateBoardInput: any) => {
      if (!boardId) {
        console.error('handleBoardUpdate: boardId is required');
        return;
      }

      const filteredImages = uploadedUrls.filter((url) => url);
      const updateInput = {
        ...updateBoardInput,
        images: filteredImages.length > 0 ? filteredImages : [],
      };

      try {
        await mutateUpdateBoard({
          variables: {
            boardId,
            updateBoardInput: updateInput,
          },
        });
      } catch (error) {
        console.error('게시글 수정 실패:', error);
        throw error;
      }
    },
    [boardId, uploadedUrls, mutateUpdateBoard],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => revokePreviewUrl(url));
    };
  }, [previewUrls, revokePreviewUrl]);

  return useMemo(
    () => ({
      uploadedUrls,
      previewUrls,
      fetchExistingImages,
      handleImageUpload,
      handleImageDelete,
      handleBoardUpdate,
    }),
    [
      uploadedUrls,
      previewUrls,
      fetchExistingImages,
      handleImageUpload,
      handleImageDelete,
      handleBoardUpdate,
    ],
  );
};

