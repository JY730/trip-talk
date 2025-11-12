'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

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

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

export interface UseImageUploadResult {
  uploadedUrls: string[];
  previewUrls: string[];
  handleImageUpload: (index: number, file: File) => Promise<void>;
  handleImageDelete: (index: number) => void;
}

export const useImageUpload = (): UseImageUploadResult => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(
    Array.from({ length: MAX_UPLOAD_SLOTS }, () => ''),
  );
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    Array.from({ length: MAX_UPLOAD_SLOTS }, () => ''),
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mutateUpload: any = async () => {
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
      let targetIndex = index;

      setPreviewUrls((prev) => {
        const next = [...prev];
        const availableIndex = next.findIndex((value) => !value);
        targetIndex = availableIndex === -1 ? index : availableIndex;
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

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => revokePreviewUrl(url));
    };
  }, [previewUrls, revokePreviewUrl]);

  return useMemo(
    () => ({
      uploadedUrls,
      previewUrls,
      handleImageUpload,
      handleImageDelete,
    }),
    [uploadedUrls, previewUrls, handleImageDelete, handleImageUpload],
  );
};
