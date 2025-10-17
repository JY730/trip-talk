/**
 * URL Routing Configuration
 * Application URL 경로 관리 시스템
 * 
 * Last Updated: 2025-10-17
 */

/**
 * 접근 권한 타입
 */
export type AccessType = 'public' | 'member-only';

/**
 * URL 메타데이터 타입
 */
export interface UrlMeta {
  path: string;
  access: AccessType;
  showHeader: boolean;
  showBanner: boolean;
  description?: string;
}

/**
 * URL 경로 정의
 * - 정적 경로와 동적 경로를 모두 관리
 */
export const urls = {
  /**
   * 인증 관련 경로
   */
  auth: {
    /**
     * 로그인 페이지
     * @path /auth/login
     * @access 누구나
     */
    login: (): string => '/auth/login',
    
    /**
     * 회원가입 페이지
     * @path /auth/signup
     * @access 누구나
     */
    signup: (): string => '/auth/signup',
  },

  /**
   * 게시판 관련 경로 (트립토크)
   */
  boards: {
    /**
     * 게시판 목록 페이지
     * @path /boards
     * @access 누구나
     */
    list: (): string => '/boards',
    
    /**
     * 게시글 상세 페이지
     * @path /boards/[id]
     * @access 회원전용
     * @param id 게시글 ID
     */
    detail: (id: string | number): string => `/boards/${id}`,
  },

  /**
   * 숙박권 관련 경로
   */
  products: {
    /**
     * 숙박권 구매 페이지 (목록)
     * @path /products
     * @access 누구나
     */
    list: (): string => '/products',
    
    /**
     * 숙박권 상세 페이지
     * @path /products/[id]
     * @access 누구나
     * @param id 숙박권 ID
     */
    detail: (id: string | number): string => `/products/${id}`,
  },

  /**
   * 마이페이지
   */
  mypage: {
    /**
     * 마이페이지 메인
     * @path /mypage
     * @access 누구나
     */
    main: (): string => '/mypage',
  },
} as const;

/**
 * URL 메타데이터 정의
 * - 각 URL의 접근 권한, header/banner 노출 여부 등 메타 정보
 */
export const urlMeta: Record<string, UrlMeta> = {
  '/auth/login': {
    path: '/auth/login',
    access: 'public',
    showHeader: false,
    showBanner: false,
    description: '로그인 페이지',
  },
  '/auth/signup': {
    path: '/auth/signup',
    access: 'public',
    showHeader: false,
    showBanner: false,
    description: '회원가입 페이지',
  },
  '/boards': {
    path: '/boards',
    access: 'public',
    showHeader: true,
    showBanner: true,
    description: '트립토크 게시판 목록',
  },
  '/boards/[id]': {
    path: '/boards/[id]',
    access: 'member-only',
    showHeader: true,
    showBanner: false,
    description: '게시글 상세 페이지',
  },
  '/products': {
    path: '/products',
    access: 'public',
    showHeader: true,
    showBanner: true,
    description: '숙박권 구매 목록',
  },
  '/products/[id]': {
    path: '/products/[id]',
    access: 'public',
    showHeader: true,
    showBanner: false,
    description: '숙박권 상세 페이지',
  },
  '/mypage': {
    path: '/mypage',
    access: 'public',
    showHeader: true,
    showBanner: false,
    description: '마이페이지',
  },
} as const;

/**
 * Helper: 현재 경로의 메타데이터 가져오기
 * @param pathname 현재 경로
 * @returns 메타데이터 객체 또는 undefined
 * 
 * @example
 * const meta = getUrlMeta('/boards');
 * if (meta?.showHeader) {
 *   // header 표시
 * }
 */
export const getUrlMeta = (pathname: string): UrlMeta | undefined => {
  // 정확한 경로 매칭
  if (urlMeta[pathname]) {
    return urlMeta[pathname];
  }

  // 동적 경로 매칭 (e.g., /boards/123 -> /boards/[id])
  const dynamicPatterns: Record<string, RegExp> = {
    '/boards/[id]': /^\/boards\/[^/]+$/,
    '/products/[id]': /^\/products\/[^/]+$/,
  };

  for (const [pattern, regex] of Object.entries(dynamicPatterns)) {
    if (regex.test(pathname)) {
      return urlMeta[pattern];
    }
  }

  return undefined;
};

/**
 * Helper: 회원 전용 페이지인지 확인
 * @param pathname 현재 경로
 * @returns 회원 전용 여부
 * 
 * @example
 * if (isMemberOnlyPage('/boards/123')) {
 *   // 로그인 체크
 * }
 */
export const isMemberOnlyPage = (pathname: string): boolean => {
  const meta = getUrlMeta(pathname);
  return meta?.access === 'member-only';
};

/**
 * Helper: header를 표시해야 하는지 확인
 * @param pathname 현재 경로
 * @returns header 표시 여부
 */
export const shouldShowHeader = (pathname: string): boolean => {
  const meta = getUrlMeta(pathname);
  return meta?.showHeader ?? false;
};

/**
 * Helper: banner를 표시해야 하는지 확인
 * @param pathname 현재 경로
 * @returns banner 표시 여부
 */
export const shouldShowBanner = (pathname: string): boolean => {
  const meta = getUrlMeta(pathname);
  return meta?.showBanner ?? false;
};

/**
 * Type Export
 */
export type UrlConfig = typeof urls;

