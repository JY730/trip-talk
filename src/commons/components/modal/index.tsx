/**
 * Modal Component
 * Design Source: Figma Node IDs 285:30884, 285:32916, 285:32688
 * Last Updated: 2025-01-27
 */

import React from 'react';
import { Button, type ButtonProps } from '../button';
import styles from './styles.module.css';

type ModalActionButtonProps = Omit<ButtonProps, 'children' | 'onClick'>;

export interface ModalProps {
  /**
   * 모달의 variant (색상 테마)
   */
  variant?: 'info' | 'danger';
  
  /**
   * 모달의 액션 버튼 구성
   */
  actions?: 'single' | 'dual';
  
  /**
   * 모달의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * 모달 제목
   */
  title: string;
  
  /**
   * 모달 설명
   */
  description?: string;
  
  /**
   * 로고 표시 여부
   */
  showLogo?: boolean;
  
  /**
   * 확인 버튼 텍스트
   */
  confirmText?: string;
  
  /**
   * 취소 버튼 텍스트 (dual 액션일 때만 사용)
   */
  cancelText?: string;
  
  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm?: () => void;
  
  /**
   * 취소 버튼 클릭 핸들러 (dual 액션일 때만 사용)
   */
  onCancel?: () => void;
  
  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 확인 버튼에 전달할 추가 props (data-testid 등)
   */
  confirmButtonProps?: ModalActionButtonProps;

  /**
   * 취소 버튼에 전달할 추가 props (data-testid 등)
   */
  cancelButtonProps?: ModalActionButtonProps;
}

/**
 * Modal Component
 * 
 * @example
 * // Info variant with single action
 * <Modal
 *   variant="info"
 *   actions="single"
 *   title="비밀번호 변경 완료"
 *   description="비밀번호가 변경 되었습니다."
 *   confirmText="확인"
 *   onConfirm={() => console.log('확인')}
 * />
 * 
 * @example
 * // Danger variant with dual actions
 * <Modal
 *   variant="danger"
 *   actions="dual"
 *   title="정말 삭제하시겠습니까?"
 *   description="삭제된 데이터는 복구할 수 없습니다."
 *   confirmText="삭제"
 *   cancelText="취소"
 *   onConfirm={() => console.log('삭제')}
 *   onCancel={() => console.log('취소')}
 * />
 */
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      variant = 'info',
      actions = 'single',
      theme = 'light',
      title,
      description,
      showLogo = false,
      confirmText = '확인',
      cancelText = '취소',
      onConfirm,
      onCancel,
      className = '',
      confirmButtonProps,
      cancelButtonProps,
      ...rest
    },
    ref
  ) => {
    // 클래스명 조합
    const classNames = [
      styles.modal,
      styles[`variant-${variant}`],
      styles[`actions-${actions}`],
      styles[`theme-${theme}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classNames}
        {...rest}
      >
        <div className={styles.content}>
          {/* 로고 영역 */}
          {showLogo && (
            <div className={styles.logoArea}>
              <div className={styles.logo}>
                {/* 로고 이미지 또는 아이콘 */}
              </div>
            </div>
          )}
          
          {/* 제목 */}
          <h2 className={styles.title}>
            {title}
          </h2>
          
          {/* 설명 */}
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
          
          {/* 버튼 영역 */}
          <div className={styles.buttonArea}>
            {actions === 'dual' && (
              <Button
                variant="secondary"
                styleType="outline"
                size="medium"
                theme="light"
                shape="rectangle"
                className={styles.cancelButton}
                onClick={onCancel}
                {...cancelButtonProps}
              >
                {cancelText}
              </Button>
            )}
            
            <Button
              variant="primary"
              styleType="filled"
              size="medium"
              shape="rectangle"
              theme="light"
              className={styles.confirmButton}
              onClick={onConfirm}
              {...confirmButtonProps}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
