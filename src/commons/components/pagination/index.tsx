/**
 * Pagination Component
 * Design Source: Figma Node IDs
 *   - Primary: 9108:12975
 *   - Secondary: 9108:13141
 *   - Tertiary: 9108:13157
 * Last Updated: 2025-10-17
 */

import React from 'react';
import styles from './styles.module.css';

export interface PaginationProps {
  /**
   * 페이지네이션의 variant (색상 테마)
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 페이지네이션의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 페이지네이션의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage: number;
  
  /**
   * 전체 페이지 수
   */
  totalPages: number;
  
  /**
   * 페이지 변경 핸들러
   */
  onPageChange: (page: number) => void;
  
  /**
   * 표시할 최대 페이지 버튼 수
   */
  maxPageButtons?: number;
  
  /**
   * 이전 버튼 비활성화
   */
  disablePrevious?: boolean;
  
  /**
   * 다음 버튼 비활성화
   */
  disableNext?: boolean;
  
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * Pagination Component
 * 
 * @example
 * // Primary pagination (large)
 * <Pagination 
 *   variant="primary" 
 *   size="large"
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 * />
 * 
 * @example
 * // Secondary pagination with custom max buttons
 * <Pagination 
 *   variant="secondary" 
 *   size="medium"
 *   currentPage={3}
 *   totalPages={20}
 *   maxPageButtons={7}
 *   onPageChange={(page) => console.log(page)}
 * />
 */
export const Pagination: React.FC<PaginationProps> = ({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
  disablePrevious,
  disableNext,
  className = '',
}) => {
  // 페이지 범위 계산
  const getPageNumbers = () => {
    const pages: number[] = [];
    
    if (totalPages <= maxPageButtons) {
      // 전체 페이지가 최대 버튼 수보다 작으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 표시할 페이지 계산
      const halfButtons = Math.floor(maxPageButtons / 2);
      let startPage = Math.max(1, currentPage - halfButtons);
      const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      
      // 끝 페이지가 총 페이지에 가까우면 시작 페이지 조정
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  
  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 1 && !disablePrevious) {
      onPageChange(currentPage - 1);
    }
  };
  
  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages && !disableNext) {
      onPageChange(currentPage + 1);
    }
  };
  
  // 특정 페이지로 이동
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Container 클래스명 조합
  const containerClassNames = [
    styles.pagination,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClassNames}>
      {/* 이전 버튼 */}
      <button
        className={`${styles.arrowButton} ${styles.prevButton} ${
          (currentPage === 1 || disablePrevious) ? styles.disabled : ''
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1 || disablePrevious}
        aria-label="이전 페이지"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* 페이지 번호 버튼들 */}
      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.selected : ''
            }`}
            onClick={() => handlePageClick(page)}
            aria-label={`${page} 페이지`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        className={`${styles.arrowButton} ${styles.nextButton} ${
          (currentPage === totalPages || disableNext) ? styles.disabled : ''
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages || disableNext}
        aria-label="다음 페이지"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

Pagination.displayName = 'Pagination';

export default Pagination;

