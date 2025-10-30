'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { urls, isMemberOnlyPage } from '@/commons/constants/url';
import { useAuthStore, LoggedInUser } from '@/commons/stores/useAuth.store';

interface AuthContextValue {
  isLoggedIn: boolean;
  user: LoggedInUser | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // 초기 마운트: localStorage → Zustand 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedToken = localStorage.getItem('accessToken');
    const storedUserRaw = localStorage.getItem('user');
    let parsedUser: LoggedInUser | null = null;
    if (storedUserRaw) {
      try {
        parsedUser = JSON.parse(storedUserRaw);
      } catch {
        parsedUser = null;
      }
    }
    if (storedToken || parsedUser) {
      setAuth(storedToken ?? null, parsedUser);
    }
  }, [setAuth]);

  // 상태 변화 구독: 로그인 해제 시 자동 리다이렉트 제거 (드롭다운 로그아웃에서 처리)
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   const unsubscribe = useAuthStore.subscribe((state) => state.accessToken, (token) => {
  //     if (!token) {
  //       router.push(urls.auth.login());
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [router]);

  // 회원 전용 페이지 접근 시, 비로그인이라면 로그인 페이지로 이동
  useEffect(() => {
    if (!pathname) return;
    if (!accessToken && isMemberOnlyPage(pathname)) {
      router.push(urls.auth.login());
    }
  }, [accessToken, pathname, router]);

  // accessToken 변경 시, localStorage의 user를 최신으로 동기화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!accessToken) return;
    const storedUserRaw = localStorage.getItem('user');
    let parsedUser: LoggedInUser | null = null;
    if (storedUserRaw) {
      try {
        parsedUser = JSON.parse(storedUserRaw);
      } catch {
        parsedUser = null;
      }
    }
    setAuth(accessToken, parsedUser);
  }, [accessToken, setAuth]);

  const login = useCallback(() => {
    router.push(urls.auth.login());
  }, [router]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    clearAuth();
    // 게시글 목록으로 이동 후 전체 새로고침
    if (typeof window !== 'undefined') {
      window.location.href = urls.boards.list();
    }
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(() => ({
    isLoggedIn: Boolean(accessToken),
    user,
    login,
    logout,
  }), [accessToken, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


