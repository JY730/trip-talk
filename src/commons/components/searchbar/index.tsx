/**
 * SearchBar Component
 * Design Source: Figma Node IDs 9111:13207, 9111:13212, 9111:13216, 9111:13220
 * Last Updated: 2025-10-17
 */

import React, { useState, useRef } from 'react';
import styles from './styles.module.css';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * SearchBar의 크기
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * SearchBar의 테마
   */
  theme?: 'light' | 'dark';
  
  /**
   * 검색 아이콘 표시 여부
   */
  showIcon?: boolean;
  
  /**
   * 닫기 버튼 표시 여부 (값이 있을 때만 표시)
   */
  showClearButton?: boolean;
  
  /**
   * 검색 버튼 클릭 핸들러
   */
  onSearch?: (value: string) => void;
  
  /**
   * 닫기 버튼 클릭 핸들러
   */
  onClear?: () => void;
  
  /**
   * 컨테이너 클래스명
   */
  containerClassName?: string;
}

/**
 * SearchBar Component
 * 
 * State variants:
 * - default: 초기 상태 (포커스 없고 값도 없음)
 * - selected: 포커스된 상태 (값은 없음)
 * - filled: 값이 있는 상태 (포커스 없음)
 * - typing: 포커스되고 값도 있는 상태
 * 
 * @example
 * // Basic search bar
 * <SearchBar 
 *   size="large" 
 *   placeholder="제목을 검색해 주세요."
 *   onSearch={(value) => console.log(value)}
 * />
 * 
 * @example
 * // Small search bar
 * <SearchBar 
 *   size="small" 
 *   placeholder="검색"
 * />
 * 
 * @example
 * // Dark theme search bar
 * <SearchBar 
 *   size="medium" 
 *   theme="dark"
 *   placeholder="제목을 검색해 주세요."
 * />
 */
export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      size = 'large',
      theme = 'light',
      showIcon = true,
      showClearButton = true,
      onSearch,
      onClear,
      containerClassName = '',
      className = '',
      placeholder = '제목을 검색해 주세요.',
      value: controlledValue,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    // ref 병합
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    
    // value 처리 (제어/비제어 컴포넌트 모두 지원)
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const hasValue = value !== undefined && value !== null && value !== '';
    
    // State 결정 로직
    const getState = () => {
      if (isFocused && hasValue) return 'typing';
      if (isFocused && !hasValue) return 'selected';
      if (!isFocused && hasValue) return 'filled';
      return 'default';
    };
    
    const state = getState();
    
    // 클래스명 조합
    const containerClassNames = [
      styles.searchBar,
      styles[`state-${state}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      containerClassName,
    ]
      .filter(Boolean)
      .join(' ');
    
    const inputClassNames = [
      styles.input,
      className,
    ]
      .filter(Boolean)
      .join(' ');
    
    // 이벤트 핸들러
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledValue === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch?.(value as string);
      }
      onKeyDown?.(e);
    };
    
    const handleClear = () => {
      if (controlledValue === undefined) {
        setInternalValue('');
      }
      // 부모 컴포넌트에 값 초기화 알림
      onChange?.({
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
      onClear?.();
      // 포커스 유지
      inputRef.current?.focus();
    };

    return (
      <div className={containerClassNames}>
        {showIcon && (
          <div className={styles.iconWrapper}>
            <img
              src={theme === 'dark' ? '/icons/search_w.svg' : '/icons/search.svg'}
              alt="search"
              className={styles.searchIcon}
            />
          </div>
        )}
        <input
          ref={inputRef}
          className={inputClassNames}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {showClearButton && hasValue && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            <img
              src="/icons/close.svg"
              alt="close"
              className={styles.clearIcon}
            />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;

