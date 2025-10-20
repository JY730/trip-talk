import { usePathname } from 'next/navigation';
import { shouldShowHeader, shouldShowBanner } from '@/commons/constants/url';

/**
 * Layout Area 영역 노출 여부를 관리하는 Hook
 * - url.ts의 메타데이터를 기반으로 header/banner 표시 여부를 반환
 * 
 * @returns {Object} 영역 노출 여부 객체
 * @returns {boolean} isHeaderVisible - header 영역 표시 여부
 * @returns {boolean} isBannerVisible - banner 영역 표시 여부
 * 
 * @example
 * const { isHeaderVisible, isBannerVisible } = useAreaVisibility();
 * 
 * return (
 *   <>
 *     {isHeaderVisible && <header>...</header>}
 *     {isBannerVisible && <Banner />}
 *   </>
 * );
 */
export const useAreaVisibility = () => {
  const pathname = usePathname();

  const isHeaderVisible = shouldShowHeader(pathname);
  const isBannerVisible = shouldShowBanner(pathname);

  return {
    isHeaderVisible,
    isBannerVisible,
  };
};

