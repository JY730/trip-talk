/**
 * Address Hook
 * 주소 검색 및 입력 기능을 제공하는 커스텀 훅
 * react-daum-postcode를 사용한 주소 검색 기능
 * Last Updated: 2025-01-27
 */

'use client';

import { useState, useCallback, type ChangeEvent } from 'react';

export interface AddressData {
  zipcode: string;
  address: string;
  addressDetail: string;
}

export interface UseAddressReturn {
  zipcode: string;
  address: string;
  addressDetail: string;
  isModalOpen: boolean;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
  handleComplete: (data: any) => void;
  handleAddressDetailChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useAddress = (): UseAddressReturn => {
  const [zipcode, setZipcode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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

  const handleAddressDetailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAddressDetail(e.target.value || '');
  }, []);

  return {
    zipcode,
    address,
    addressDetail,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleComplete,
    handleAddressDetailChange,
  };
};

