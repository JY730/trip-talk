'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type BaseSyntheticEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gql, ApolloError } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { urls } from '@/commons/constants/url';

const FETCH_BOARD_FOR_EDIT = gql`
  query FetchBoardForEdit($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id
      writer
      title
      contents
      youtubeUrl
      images
      boardAddress {
        address
        addressDetail
        zipcode
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_BOARD = gql`
  mutation UpdateBoard($boardId: ID!, $password: String!, $updateBoardInput: UpdateBoardInput!) {
    updateBoard(boardId: $boardId, password: $password, updateBoardInput: $updateBoardInput) {
      _id
      title
      contents
      youtubeUrl
      images
      boardAddress {
        address
        addressDetail
        zipcode
      }
      updatedAt
    }
  }
`;

const boardAddressSchema = z.object({
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  zipcode: z.string().optional(),
});

const boardUpdateSchema = z.object({
  writer: z.string().optional(),
  title: z.string().min(2, '제목은 2자 이상 입력해 주세요.'),
  contents: z.string().min(1, '내용을 입력해 주세요.'),
  youtubeUrl: z
    .string()
    .trim()
    .url('유효한 URL을 입력해 주세요.')
    .or(z.literal(''))
    .nullable()
    .optional(),
  boardAddress: boardAddressSchema.optional(),
  images: z.array(z.string()).optional(),
});

export type BoardUpdateFormData = z.infer<typeof boardUpdateSchema>;

interface FetchBoardForEditResponse {
  fetchBoard: {
    _id: string;
    writer?: string;
    title: string;
    contents: string;
    youtubeUrl?: string | null;
    images?: string[] | null;
    boardAddress?: {
      address?: string | null;
      addressDetail?: string | null;
      zipcode?: string | null;
    } | null;
    createdAt: string;
    updatedAt: string;
  };
}

type UpdateBoardInput = {
  title?: string;
  contents?: string;
  youtubeUrl?: string | null;
  boardAddress?: {
    address?: string | null;
    addressDetail?: string | null;
    zipcode?: string | null;
  } | null;
  images?: string[] | null;
};

interface UseBoardUpdateFormReturn {
  form: UseFormReturn<BoardUpdateFormData>;
  isSubmitEnabled: boolean;
  isInitializing: boolean;
  isSubmitting: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
  writerName: string;
  updatedAt?: string;
  errorMessage: string | null;
}

const extractDefaultValues = (
  data?: FetchBoardForEditResponse['fetchBoard']
): BoardUpdateFormData => ({
  writer: data?.writer ?? '',
  title: data?.title ?? '',
  contents: data?.contents ?? '',
  youtubeUrl: data?.youtubeUrl ?? '',
  boardAddress: {
    address: data?.boardAddress?.address ?? '',
    addressDetail: data?.boardAddress?.addressDetail ?? '',
    zipcode: data?.boardAddress?.zipcode ?? '',
  },
  images: data?.images ?? [],
});

export default function useBoardUpdateForm(): UseBoardUpdateFormReturn {
  const params = useParams();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const boardId = params?.id as string | undefined;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data,
    loading: isFetching,
    error: fetchError,
  } = useQuery<FetchBoardForEditResponse>(FETCH_BOARD_FOR_EDIT, {
    variables: {
      boardId: boardId ?? '',
    },
    skip: !boardId,
    fetchPolicy: 'network-only',
  });

  const [updateBoardMutation, { loading: isSubmitting } ] = useMutation(UPDATE_BOARD);

  const form = useForm<BoardUpdateFormData>({
    resolver: zodResolver(boardUpdateSchema),
    defaultValues: extractDefaultValues(),
    mode: 'onChange',
  });

  const initialValuesRef = useRef<BoardUpdateFormData>(extractDefaultValues());

  useEffect(() => {
    if (fetchError) {
      console.error('게시글 정보를 불러오는데 실패했습니다.', fetchError);
      setErrorMessage('게시글 정보를 불러오는데 실패했습니다.');
    }
  }, [fetchError]);

  useEffect(() => {
    if (data?.fetchBoard) {
      const nextValues = extractDefaultValues(data.fetchBoard);
      initialValuesRef.current = nextValues;
      form.reset(nextValues, { keepDefaultValues: false });
      setErrorMessage(null);
    }
  }, [data, form]);

  const buildUpdateInput = useCallback(
    (values: BoardUpdateFormData): UpdateBoardInput => {
      const initial = initialValuesRef.current;
      const input: UpdateBoardInput = {};

      if (values.title !== initial.title) {
        input.title = values.title;
      }

      if (values.contents !== initial.contents) {
        input.contents = values.contents;
      }

      const nextYoutube = values.youtubeUrl?.toString().trim() || '';
      const initialYoutube = initial.youtubeUrl?.toString().trim() || '';
      if (nextYoutube !== initialYoutube) {
        input.youtubeUrl = nextYoutube || null;
      }

      const nextAddress = values.boardAddress?.address?.trim() || '';
      const initialAddress = initial.boardAddress?.address?.trim() || '';
      const nextAddressDetail = values.boardAddress?.addressDetail?.trim() || initial.boardAddress?.addressDetail?.trim() || '';
      const initialAddressDetail = initial.boardAddress?.addressDetail?.trim() || '';
      const nextZipcode = values.boardAddress?.zipcode?.trim() || initial.boardAddress?.zipcode?.trim() || '';
      const initialZipcode = initial.boardAddress?.zipcode?.trim() || '';

      if (
        nextAddress !== initialAddress ||
        nextAddressDetail !== initialAddressDetail ||
        nextZipcode !== initialZipcode
      ) {
        input.boardAddress = {
          address: nextAddress || null,
          addressDetail: nextAddressDetail || null,
          zipcode: nextZipcode || null,
        };
      }

      const normalizedImages = values.images ?? [];
      const initialImages = initial.images ?? [];
      const isImagesDifferent =
        normalizedImages.length !== initialImages.length ||
        normalizedImages.some((image, index) => image !== initialImages[index]);

      if (isImagesDifferent) {
        input.images = normalizedImages;
      }

      return input;
    },
    []
  );

  const onSubmitHandler = useCallback(
    async (values: BoardUpdateFormData) => {
      if (!boardId) {
        setErrorMessage('존재하지 않는 게시글입니다.');
        return;
      }

      const password = prompt('글을 입력할 때 입력하셨던 비밀번호를 입력해주세요');

      if (!password) {
        alert('비밀번호를 입력해야 수정할 수 있습니다.');
        return;
      }

      const updateBoardInput = buildUpdateInput(values);

      if (Object.keys(updateBoardInput).length === 0) {
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="변경된 내용이 없습니다."
            description="수정된 항목이 있을 때만 요청이 전송됩니다."
            confirmText="확인"
            onConfirm={() => closeModal()}
          />
        );
        return;
      }

      try {
        const result = await updateBoardMutation({
          variables: {
            boardId,
            password,
            updateBoardInput,
          },
        });

        const updatedId = result.data?.updateBoard?._id;

        openModal(
          <Modal
            variant="info"
            actions="single"
            title="게시글 수정이 완료되었습니다."
            description="게시글이 성공적으로 수정되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              if (updatedId) {
                router.push(urls.boards.detail(updatedId));
              }
            }}
          />
        );
      } catch (error) {
        const apolloError = error as ApolloError;
        const passwordError = apolloError.graphQLErrors?.some(({ message }) =>
          message?.includes('비밀번호')
        );

        if (passwordError) {
          alert('비밀번호가 일치하지 않습니다.');
        }

        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="게시글 수정 실패"
            description="에러가 발생하였습니다. 다시 시도해 주세요."
            confirmText="확인"
            onConfirm={() => closeModal()}
          />
        );
      }
    },
    [boardId, buildUpdateInput, closeModal, openModal, router, updateBoardMutation]
  );

  const onCancel = useCallback(() => {
    if (boardId) {
      router.push(urls.boards.detail(boardId));
    } else {
      router.push(urls.boards.list());
    }
  }, [boardId, router]);

  const { formState } = form;

  const isDirty = useMemo(() => {
    const { dirtyFields } = formState;
    return Object.keys(dirtyFields).length > 0;
  }, [formState]);

  const isSubmitEnabled = !isFetching && !isSubmitting && formState.isValid && isDirty;

  return {
    form,
    isSubmitEnabled,
    isInitializing: isFetching && !data,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmitHandler),
    onCancel,
    writerName: form.getValues('writer') ?? '',
    updatedAt: data?.fetchBoard?.updatedAt,
    errorMessage,
  };
}


