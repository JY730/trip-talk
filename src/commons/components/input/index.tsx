/**
 * Input Component
 * Design Source: Figma Node IDs 285:31852, 285:31825
 * Last Updated: 2025-10-17
 */

import React from 'react';
import styles from './styles.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input의 variant (색상 테마)
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Input의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Input의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * 에러 상태
   */
  error?: boolean;
  
  /**
   * 레이블 텍스트
   */
  label?: string;
  
  /**
   * 필수 입력 표시
   */
  required?: boolean;
  
  /**
   * 에러 메시지
   */
  errorMessage?: string;
  
  /**
   * 오른쪽 버튼 (선택적)
   */
  rightButton?: React.ReactNode;
  
  /**
   * 컨테이너 클래스명
   */
  containerClassName?: string;
}

/**
 * Input Component
 * 
 * @example
 * // Primary input with label
 * <Input 
 *   variant="primary" 
 *   size="large" 
 *   label="상품명" 
 *   placeholder="상품명을 입력해 주세요."
 *   required
 * />
 * 
 * @example
 * // Input with error state
 * <Input 
 *   variant="primary" 
 *   size="large" 
 *   label="이메일" 
 *   error
 *   errorMessage="올바른 이메일 주소를 입력해주세요."
 * />
 * 
 * @example
 * // Input with right button
 * <Input 
 *   variant="primary" 
 *   size="large" 
 *   label="주소" 
 *   placeholder="01234"
 *   rightButton={<Button>우편번호 검색</Button>}
 *   required
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'primary',
      size = 'large',
      theme = 'light',
      error = false,
      label,
      required = false,
      errorMessage,
      rightButton,
      containerClassName = '',
      className = '',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // Input 클래스명 조합
    const inputClassNames = [
      styles.input,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      error && styles.error,
      disabled && styles.disabled,
      rightButton && styles.hasButton,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Container 클래스명 조합
    const containerClassNames = [
      styles.container,
      containerClassName,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClassNames}>
        {label && (
          <div className={styles.labelArea}>
            <label className={styles.label}>
              {label}
            </label>
            {required && (
              <span className={styles.required}>*</span>
            )}
          </div>
        )}
        <div className={styles.inputWrapper}>
          <div className={styles.inputArea}>
            <input
              ref={ref}
              className={inputClassNames}
              disabled={disabled}
              {...rest}
            />
          </div>
          {rightButton && (
            <div className={styles.buttonArea}>
              {rightButton}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

