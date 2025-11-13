/**
 * Address Edit Hook
 * 게시글 수정 시 주소 검색 및 입력 기능을 제공하는 커스텀 훅
 * react-daum-postcode를 사용한 주소 검색 기능
 * fetchBoard로 기존 주소 데이터 로드 및 updateBoard 호출
 * Last Updated: 2025-01-27
 */

'use client';

import { useState, useCallback, useEffect, type ChangeEvent } from 'react';
import { gql, ApolloError } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { urls } from '@/commons/constants/url';

const FETCH_BOARD = gql`
  query FetchBoard($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id
      writer
      title
      contents
      boardAddress {
        zipcode
        address
        addressDetail
      }
      youtubeUrl
      createdAt
    }
  }
`;

const UPDATE_BOARD = gql`
  mutation UpdateBoard($updateBoardInput: UpdateBoardInput!, $password: String, $boardId: ID!) {
    updateBoard(updateBoardInput: $updateBoardInput, password: $password, boardId: $boardId) {
      _id
      title
      contents
      boardAddress {
        zipcode
        address
        addressDetail
      }
      youtubeUrl
      updatedAt
    }
  }
`;

interface FetchBoardResponse {
  fetchBoard: {
    _id: string;
    writer?: string;
    title: string;
    contents: string;
    boardAddress?: {
      zipcode?: string | null;
      address?: string | null;
      addressDetail?: string | null;
    } | null;
    youtubeUrl?: string | null;
    createdAt: string;
  };
}

export interface UseAddressEditReturn {
  zipcode: string;
  address: string;
  addressDetail: string;
  isModalOpen: boolean;
  handleAddressSearch: () => void;
  handleAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpdateBoard: (updateData: { title: string; contents: string; youtubeUrl?: string | null }) => Promise<void>;
  handleComplete: (data: any) => void;
  handleCloseModal: () => void;
}

export const useAddressEdit = (boardId: string): UseAddressEditReturn => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  
  const [zipcode, setZipcode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // fetchBoard로 기존 게시글 데이터 로드
  const { data, loading: isFetching } = useQuery<FetchBoardResponse>(FETCH_BOARD, {
    variables: { boardId },
    skip: !boardId,
    fetchPolicy: 'network-only',
  });

  const [updateBoardMutation, { loading: isSubmitting }] = useMutation(UPDATE_BOARD);

  // fetchBoard 응답으로 주소 초기값 설정
  useEffect(() => {
    if (data?.fetchBoard?.boardAddress) {
      const boardAddress = data.fetchBoard.boardAddress;
      setZipcode(boardAddress.zipcode || '');
      setAddress(boardAddress.address || '');
      setAddressDetail(boardAddress.addressDetail || '');
    }
  }, [data]);

  // react-daum-postcode 모달 열기
  const handleAddressSearch = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // react-daum-postcode 완료 핸들러
  const handleComplete = useCallback((data: any) => {
    try {
      const fullAddress = data.address || '';
      const extraAddress = data.extraAddress || '';
      const selectedAddress = fullAddress + (extraAddress ? ` ${extraAddress}` : '');
      
      setZipcode(data.zonecode || '');
      setAddress(selectedAddress || '');
      setIsModalOpen(false);
    } catch (error) {
      console.error('주소 검색 중 문제가 발생했습니다:', error);
      alert('주소 검색 중 문제가 발생했습니다.');
      setIsModalOpen(false);
    }
  }, []);

  // 상세주소 직접 입력 핸들러
  const handleAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddressDetail(e.target.value || '');
  }, []);

  // updateBoard API 호출
  const handleUpdateBoard = useCallback(
    async (updateData: { title: string; contents: string; youtubeUrl?: string | null }) => {
      try {
        const password = prompt('글을 입력할 때 입력하셨던 비밀번호를 입력해주세요');
        
        if (!password) {
          alert('비밀번호를 입력해야 수정할 수 있습니다.');
          return;
        }

        const updateBoardInput: {
          title: string;
          contents: string;
          youtubeUrl?: string | null;
          boardAddress?: {
            zipcode: string;
            address: string;
            addressDetail: string;
          } | null;
        } = {
          title: updateData.title,
          contents: updateData.contents,
          youtubeUrl: updateData.youtubeUrl || null,
          boardAddress: {
            zipcode: zipcode || '',
            address: address || '',
            addressDetail: addressDetail || '',
          },
        };

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
        console.error('게시글 수정 중 오류가 발생했습니다:', error);
        const apolloError = error as ApolloError;
        const passwordError = apolloError.graphQLErrors?.some(({ message }) =>
          message?.includes('비밀번호')
        );

        if (passwordError) {
          alert('비밀번호가 일치하지 않습니다.');
        } else {
          alert('게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      }
    },
    [boardId, zipcode, address, addressDetail, updateBoardMutation, openModal, closeModal, router]
  );

  return {
    zipcode,
    address,
    addressDetail,
    isModalOpen,
    handleAddressSearch,
    handleAddressChange,
    handleUpdateBoard,
    handleComplete,
    handleCloseModal: () => setIsModalOpen(false),
  };
};

