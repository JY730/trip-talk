'use client';

import { useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { urls } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { Modal } from '@/commons/components/modal';
import { useAuth } from '@/commons/providers/auth/auth.provider';

type AnyFunction<TReturn = unknown> = (...args: unknown[]) => TReturn | Promise<TReturn>;

export interface GuardOptions {
  // 향후 옵션 확장 포인트 (예: 강제 회원가드 등)
}

/**
 * 액션 실행 시점에 로그인 여부를 검사하는 Guard 훅
 * - 실패 시: "로그인하시겠습니까" 모달 1회 노출 → 로그인 이동 또는 취소
 * - 테스트환경 분기: NEXT_PUBLIC_TEST_ENV === 'test'
 *   - 기본 동작: 로그인검사 BYPASS (window.__TEST_BYPASS__ !== false)
 * - 실환경 분기:
 *   - 기본 동작: 로그인검사 수행 (window.__TEST_BYPASS__ === true 인 경우에만 BYPASS)
 */
export const useAuthActionGuard = () => {
  const router = useRouter();
  const { openModal, closeModal, isOpen } = useModal();
  const auth = useAuth();

  // 모달은 같은 상황에서 한 번만 노출되어야 함
  const hasShownLoginModalRef = useRef(false);

  const isLoggedIn = useMemo<boolean>(() => {
    // auth provider에 isLoggedIn이 있으면 우선 사용, 없으면 user 존재로 판단
    const candidate = (auth as unknown as { isLoggedIn?: boolean }).isLoggedIn;
    if (typeof candidate === 'boolean') return candidate;
    return Boolean((auth as unknown as { user?: unknown }).user);
  }, [auth]);

  const shouldBypassAuthCheck = useMemo<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test';
    const testBypassFlag = (window as unknown as { __TEST_BYPASS__?: unknown }).__TEST_BYPASS__;

    // 테스트 환경: 기본 BYPASS (flag !== false)
    if (isTestEnv) return testBypassFlag !== false;

    // 실환경: 기본 검사, flag === true 인 경우에만 BYPASS
    return testBypassFlag === true;
  }, []);

  const showLoginAskModalOnce = useCallback(() => {
    if (hasShownLoginModalRef.current) return;
    hasShownLoginModalRef.current = true;

    openModal(
      <Modal
        variant="info"
        actions="dual"
        title="로그인하시겠습니까?"
        description="회원 전용 기능입니다. 로그인 후 이용하실 수 있어요."
        confirmText="로그인하러가기"
        cancelText="취소"
        onConfirm={() => {
          // 1) 열려있는 모든 모달 닫기
          if (isOpen) closeModal();
          // 2) 로그인 페이지로 이동
          router.push(urls.auth.login());
        }}
        onCancel={() => {
          // 1) 열려있는 모든 모달 닫기
          if (isOpen) closeModal();
        }}
      />
    );
  }, [closeModal, isOpen, openModal, router]);

  const guard = useCallback(
    <T extends AnyFunction>(action: T, _options?: GuardOptions) => {
      return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | undefined> => {
        // 테스트 분기에서 BYPASS 허용
        if (shouldBypassAuthCheck) {
          return await action(...args);
        }

        // 로그인 상태라면 실행
        if (isLoggedIn) {
          return await action(...args);
        }

        // 비로그인: 모달 1회 노출 후 종료
        showLoginAskModalOnce();
        return undefined;
      }) as (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined>;
    },
    [isLoggedIn, shouldBypassAuthCheck, showLoginAskModalOnce]
  );

  return { guard };
};

export default useAuthActionGuard;


