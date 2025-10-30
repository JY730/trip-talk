'use client';

/**
 * Auth Signup Component
 * Design Source: Figma Node ID 285:32642
 * Last Updated: 2025-01-27
 */

import React from 'react';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

export interface AuthSignupProps {
  /**
   * 이메일 입력값
   */
  email?: string;
  
  /**
   * 이름 입력값
   */
  name?: string;
  
  /**
   * 비밀번호 입력값
   */
  password?: string;
  
  /**
   * 비밀번호 확인 입력값
   */
  confirmPassword?: string;
  
  /**
   * 이메일 변경 핸들러
   */
  onEmailChange?: (value: string) => void;
  
  /**
   * 이름 변경 핸들러
   */
  onNameChange?: (value: string) => void;
  
  /**
   * 비밀번호 변경 핸들러
   */
  onPasswordChange?: (value: string) => void;
  
  /**
   * 비밀번호 확인 변경 핸들러
   */
  onConfirmPasswordChange?: (value: string) => void;
  
  /**
   * 회원가입 버튼 클릭 핸들러
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
   * 폼 유효성 상태
   */
  isFormValid?: boolean;
}

/**
 * Auth Signup Component
 * 
 * @example
 * <AuthSignup 
 *   email="user@example.com"
 *   name="홍길동"
 *   password="password123"
 *   confirmPassword="password123"
 *   onEmailChange={(value) => console.log(value)}
 *   onNameChange={(value) => console.log(value)}
 *   onPasswordChange={(value) => console.log(value)}
 *   onConfirmPasswordChange={(value) => console.log(value)}
 *   onSignupClick={() => console.log('Signup clicked')}
 * />
 */
export const AuthSignup = React.forwardRef<HTMLDivElement, AuthSignupProps>(
  (
    {
      email = '',
      name = '',
      password = '',
      confirmPassword = '',
      onEmailChange,
      onNameChange,
      onPasswordChange,
      onConfirmPasswordChange,
      onSignupClick,
      error = false,
      errorMessage = '',
      loading = false,
      isFormValid = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref} className={styles.container} {...rest}>
        {/* 배경 이미지 영역 */}
        <div className={styles.backgroundArea}></div>

        {/* 회원가입 폼 영역 */}
        <div className={styles.formArea}>
          <h1 className={styles.signupTitle}>
            회원가입
          </h1>
          
          <p className={styles.signupDescription}>
            회원가입을 위해 아래 빈칸을 모두 채워 주세요.
          </p>
          
          <div className={styles.inputGroup}>
            {/* 이메일 입력 */}
            <div data-testid="signup-email">
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="email"
                label="이메일"
                placeholder="이메일을 입력해 주세요."
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                error={error}
                errorMessage={errorMessage}
                required
                className={styles.input}
              />
            </div>

            {/* 이름 입력 */}
            <div data-testid="signup-name">
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="text"
                label="이름"
                placeholder="이름을 입력해 주세요."
                value={name}
                onChange={(e) => onNameChange?.(e.target.value)}
                error={error}
                required
                className={styles.input}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div data-testid="signup-password">
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="password"
                label="비밀번호"
                placeholder="비밀번호를 입력해 주세요."
                value={password}
                onChange={(e) => onPasswordChange?.(e.target.value)}
                error={error}
                required
                className={styles.input}
              />
            </div>

            {/* 비밀번호 확인 입력 */}
            <div data-testid="signup-password-confirm">
              <Input
                variant="primary"
                size="medium"
                theme="light"
                type="password"
                label="비밀번호 확인"
                placeholder="비밀번호를 한번 더 입력해 주세요."
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
                error={error}
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonArea}>
            <Button
              variant="primary"
              styleType="filled"
              size="large"
              theme="light"
              shape="rectangle"
              onClick={onSignupClick}
              disabled={loading || !isFormValid}
              className={styles.signupButton}
              data-testid="signup-submit"
            >
              {loading ? '회원가입 중...' : '회원가입'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

AuthSignup.displayName = 'AuthSignup';

export default AuthSignup;
