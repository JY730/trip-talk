/**
 * Navigation Link Routing Hook
 * 
 * 현재 경로(pathname)에 따라 active 상태를 관리하는 커스텀 훅
 * 
 * @returns activeTab - 현재 활성화된 탭 ('boards' | 'products' | 'mypage')
 */

'use client';

import { usePathname } from 'next/navigation';

export type ActiveTab = 'boards' | 'products' | 'mypage';

export const useNavigationRouting = () => {
  const pathname = usePathname();
  
  /**
   * 현재 경로에 따라 activeTab 결정
   */
  const getActiveTab = (): ActiveTab => {
    if (pathname?.startsWith('/boards')) return 'boards';
    if (pathname?.startsWith('/products')) return 'products';
    if (pathname?.startsWith('/mypage')) return 'mypage';
    return 'boards'; // 기본값
  };
  
  const activeTab = getActiveTab();
  
  return {
    activeTab,
    pathname,
  };
};

