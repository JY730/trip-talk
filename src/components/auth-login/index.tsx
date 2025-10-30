'use client';

/**
 * Auth Login Component
 * Design Source: Figma Node ID 285:32713
 * Last Updated: 2025-01-27
 */

import React from 'react';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

export interface AuthLoginProps {
  /**
   * 이메일 입력값
   */
  email?: string;
  
  /**
   * 비밀번호 입력값
   */
  password?: string;
  
  /**
   * 이메일 변경 핸들러
   */
  onEmailChange?: (value: string) => void;
  
  /**
   * 비밀번호 변경 핸들러
   */
  onPasswordChange?: (value: string) => void;
  
  /**
   * 로그인 버튼 클릭 핸들러
   */
  onLoginClick?: () => void;
  
  /**
   * 회원가입 클릭 핸들러
   */
  onSignupClick?: () => void;
  
  /**
   * 에러 상태
   */
  error?: boolean;
  
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  
  /**
   * 로딩 상태
   */
  loading?: boolean;

  /**
   * 제출 가능 여부 (모든 인풋 유효 시 true)
   */
  canSubmit?: boolean;

  /**
   * 이메일 필드 에러 메시지
   */
  emailErrorMessage?: string;

  /**
   * 비밀번호 필드 에러 메시지
   */
  passwordErrorMessage?: string;
}

/**
 * Auth Login Component
 * 
 * @example
 * <AuthLogin 
 *   email="user@example.com"
 *   password="password123"
 *   onEmailChange={(value) => console.log(value)}
 *   onPasswordChange={(value) => console.log(value)}
 *   onLoginClick={() => console.log('Login clicked')}
 *   onSignupClick={() => console.log('Signup clicked')}
 * />
 */
export const AuthLogin = React.forwardRef<HTMLDivElement, AuthLoginProps>(
  (
    {
      email = '',
      password = '',
      onEmailChange,
      onPasswordChange,
      onLoginClick,
      onSignupClick,
      error = false,
      errorMessage = '',
      loading = false,
      canSubmit = false,
      emailErrorMessage,
      passwordErrorMessage,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={styles.pageContainer}
        data-testid="auth-login-page"
        {...rest}
      >
        {/* 왼쪽 로그인 폼 영역 */}
        <div className={styles.formContainer}>
          {/* 로고 영역 */}
          <div className={styles.logoArea}>
            <div className={styles.logoWrapper}>
              <img
                src="/images/logo.svg"
                alt="트립토크 로고"
                className={styles.logo}
              />
            </div>
            <h1 className={styles.welcomeTitle}>
              트립트립에 오신걸 환영합니다.
            </h1>
          </div>

          {/* 로그인 폼 영역 */}
          <div className={styles.formArea}>
            <h2 className={styles.loginTitle}>
              트립트립에 로그인 하세요.
            </h2>
            
            <div className={styles.inputGroup}>
              {/* 이메일 입력 */}
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="email"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                error={Boolean(emailErrorMessage)}
                errorMessage={emailErrorMessage}
                className={styles.input}
              />

              {/* 비밀번호 입력 */}
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="password"
                placeholder="비밀번호를 입력해 주세요."
                value={password}
                onChange={(e) => onPasswordChange?.(e.target.value)}
                error={Boolean(passwordErrorMessage)}
                errorMessage={passwordErrorMessage}
                className={styles.input}
              />
            </div>

            {/* 버튼 영역 */}
            <div className={styles.buttonArea}>
              <Button
                variant="primary"
                styleType="filled"
                size="large"
                theme="light"
                shape="rectangle"
                onClick={onLoginClick}
                disabled={loading || !canSubmit}
                className="w-full"
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
              
              <Button
                variant="tertiary"
                styleType="transparent"
                size="large"
                theme="light"
                shape="rectangle"
                onClick={onSignupClick}
                className="w-auto"
              >
                회원가입
              </Button>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지 영역 */}
        <div className={styles.imageContainer}>
          <img
            src="/images/auth_image.png"
            alt="인증 페이지 배경"
            className={styles.authImage}
          />
        </div>
      </div>
    );
  }
);

AuthLogin.displayName = 'AuthLogin';

export default AuthLogin;
