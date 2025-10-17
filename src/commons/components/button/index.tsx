/**
 * Button Component
 * Design Source: Figma Node IDs 285:32278, 285:32417, 285:32418, 285:32025, 285:33448
 * Last Updated: 2025-10-17
 */

import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 variant (색상 테마)
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * 버튼의 스타일 (배경 처리 방식)
   */
  styleType?: 'filled' | 'outline' | 'transparent';
  
  /**
   * 버튼의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 버튼의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * 왼쪽 아이콘 (선택적)
   */
  leftIcon?: React.ReactNode;
  
  /**
   * 오른쪽 아이콘 (선택적)
   */
  rightIcon?: React.ReactNode;
  
  /**
   * 버튼 텍스트
   */
  children: React.ReactNode;
}

/**
 * Button Component
 * 
 * @example
 * // Primary filled button (large)
 * <Button variant="primary" styleType="filled" size="large">
 *   트립토크 등록
 * </Button>
 * 
 * @example
 * // Secondary outline button (large)
 * <Button variant="secondary" styleType="outline" size="large">
 *   취소
 * </Button>
 * 
 * @example
 * // Tertiary transparent button (small)
 * <Button variant="tertiary" styleType="transparent" size="small" leftIcon={<BookmarkIcon />}>
 *   24
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      styleType = 'filled',
      size = 'large',
      theme = 'light',
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // 클래스명 조합
    const classNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`style-${styleType}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled}
        {...rest}
      >
        {leftIcon && (
          <span className={styles.leftIcon}>
            {leftIcon}
          </span>
        )}
        <span className={styles.label}>
          {children}
        </span>
        {rightIcon && (
          <span className={styles.rightIcon}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

