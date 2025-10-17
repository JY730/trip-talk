/**
 * Selectbox Component
 * Design Source: Figma Node ID 285:40457
 * Last Updated: 2025-10-17
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

export interface SelectOption {
  /**
   * 옵션의 고유 값
   */
  value: string | number;
  
  /**
   * 옵션에 표시될 레이블
   */
  label: string;
}

export interface SelectboxProps {
  /**
   * 선택 가능한 옵션 목록
   */
  options: SelectOption[];
  
  /**
   * 현재 선택된 값
   */
  value?: string | number;
  
  /**
   * 값이 변경될 때 호출되는 콜백
   */
  onChange?: (value: string | number) => void;
  
  /**
   * 셀렉트박스의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * 셀렉트박스의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * placeholder 텍스트
   */
  placeholder?: string;
  
  /**
   * 비활성화 여부
   */
  disabled?: boolean;
  
  /**
   * 추가 className
   */
  className?: string;
  
  /**
   * 드롭다운 컨테이너의 최대 높이 (px)
   * 지정하지 않으면 스크롤 없이 모든 메뉴가 표시됨
   */
  maxHeight?: number;
}

/**
 * Selectbox Component
 * 
 * @example
 * // 기본 사용 (스크롤 없이 모든 메뉴 표시)
 * <Selectbox
 *   options={[
 *     { value: 100, label: '100' },
 *     { value: 500, label: '500' },
 *     { value: 2000, label: '2,000' },
 *   ]}
 *   value={100}
 *   onChange={(value) => console.log(value)}
 *   placeholder="내용입력"
 * />
 * 
 * @example
 * // maxHeight를 지정하여 스크롤 사용
 * <Selectbox
 *   options={longOptions}
 *   maxHeight={200}
 *   size="small"
 *   theme="dark"
 * />
 */
export const Selectbox = React.forwardRef<HTMLDivElement, SelectboxProps>(
  (
    {
      options = [],
      value,
      onChange,
      size = 'medium',
      theme = 'light',
      placeholder = '선택해주세요',
      disabled = false,
      className = '',
      maxHeight,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // 선택된 옵션 찾기
    const selectedOption = options.find((opt) => opt.value === value);
    
    // 상태 결정: default | selected | filled
    const state = isOpen ? 'selected' : (value !== undefined ? 'filled' : 'default');
    
    // 클래스명 조합
    const containerClassNames = [
      styles.selectbox,
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      styles[`state-${state}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');
    
    // 옵션 선택 핸들러
    const handleOptionClick = (optionValue: string | number) => {
      if (!disabled) {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    };
    
    // 토글 핸들러
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };
    
    // 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);
    
    // ESC 키로 닫기
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };
      
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);
    
    // Merge refs using useCallback
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        // Update internal ref
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        
        // Update forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && 'current' in ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref]
    );
    
    return (
      <div 
        ref={mergedRef} 
        className={containerClassNames}
      >
        {/* 셀렉트박스 버튼 */}
        <button
          type="button"
          className={styles.selectButton}
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={styles.selectLabel}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className={styles.arrowIcon}>
            {isOpen ? (
              // Up arrow
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              // Down arrow
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
        </button>
        
        {/* 드롭다운 리스트 */}
        {isOpen && (
          <div 
            className={styles.dropdownList}
            style={maxHeight ? { maxHeight: `${maxHeight}px` } : undefined}
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.dropdownOption} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {isSelected && (
                    <span className={styles.checkIcon}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Selectbox.displayName = 'Selectbox';

export default Selectbox;

