/**
 * SearchBar Component Stories
 * Design Source: Figma Node IDs 9111:13207, 9111:13212, 9111:13216, 9111:13220
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { SearchBar } from './index';
import React from 'react';

const meta = {
  title: 'Commons/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'SearchBar의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'SearchBar의 테마',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder 텍스트',
    },
    showIcon: {
      control: 'boolean',
      description: '검색 아이콘 표시 여부',
    },
    disabled: {
      control: 'boolean',
      description: 'SearchBar 비활성화 여부',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default State (Large)
 * 기본 상태 - 포커스 없고 값도 없음
 */
export const DefaultLarge: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
  },
};

/**
 * Selected State (Large)
 * 포커스된 상태 - 값은 없음
 * 참고: 실제 포커스 상태는 인터랙션 시 확인 가능
 */
export const SelectedLarge: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    autoFocus: true,
  },
};

/**
 * Filled State (Large)
 * 값이 있는 상태 - 포커스 없음
 */
export const FilledLarge: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    defaultValue: '제주도 여행',
  },
};

/**
 * Typing State (Large)
 * 포커스되고 값도 있는 상태
 */
export const TypingLarge: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    defaultValue: '제주도 여행',
    autoFocus: true,
  },
};

/**
 * Medium Size
 * Medium 크기의 SearchBar
 */
export const Medium: Story = {
  args: {
    size: 'medium',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
  },
};

/**
 * Small Size
 * Small 크기의 SearchBar
 */
export const Small: Story = {
  args: {
    size: 'small',
    theme: 'light',
    placeholder: '검색',
    showIcon: true,
  },
};

/**
 * Without Icon
 * 아이콘이 없는 SearchBar
 */
export const WithoutIcon: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: false,
  },
};

/**
 * Dark Theme - Default
 * 다크 테마의 기본 상태
 */
export const DarkDefault: Story = {
  args: {
    size: 'large',
    theme: 'dark',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Selected
 * 다크 테마의 포커스 상태
 */
export const DarkSelected: Story = {
  args: {
    size: 'large',
    theme: 'dark',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    autoFocus: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Filled
 * 다크 테마의 값이 있는 상태
 */
export const DarkFilled: Story = {
  args: {
    size: 'large',
    theme: 'dark',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    defaultValue: '제주도 여행',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Typing
 * 다크 테마의 입력 중 상태
 */
export const DarkTyping: Story = {
  args: {
    size: 'large',
    theme: 'dark',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    defaultValue: '제주도 여행',
    autoFocus: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Disabled State
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    disabled: true,
  },
};

/**
 * All Sizes Comparison
 * 모든 크기를 한눈에 비교
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '640px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Large</h3>
        <SearchBar
          size="large"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Medium</h3>
        <SearchBar
          size="medium"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Small</h3>
        <SearchBar
          size="small"
          theme="light"
          placeholder="검색"
          showIcon={true}
        />
      </div>
    </div>
  ),
};

/**
 * All States (Light Theme)
 * 모든 상태를 한눈에 비교 (라이트 테마)
 */
export const AllStatesLight: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '640px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Default State</h3>
        <SearchBar
          size="large"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Selected State</h3>
        <SearchBar
          size="large"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          autoFocus={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Filled State</h3>
        <SearchBar
          size="large"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          defaultValue="제주도 여행"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Typing State</h3>
        <SearchBar
          size="large"
          theme="light"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          defaultValue="제주도 여행"
          autoFocus={true}
        />
      </div>
    </div>
  ),
};

/**
 * All States (Dark Theme)
 * 모든 상태를 한눈에 비교 (다크 테마)
 */
export const AllStatesDark: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '640px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: 'white' }}>Default State</h3>
        <SearchBar
          size="large"
          theme="dark"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: 'white' }}>Selected State</h3>
        <SearchBar
          size="large"
          theme="dark"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          autoFocus={true}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: 'white' }}>Filled State</h3>
        <SearchBar
          size="large"
          theme="dark"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          defaultValue="제주도 여행"
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: 'white' }}>Typing State</h3>
        <SearchBar
          size="large"
          theme="dark"
          placeholder="제목을 검색해 주세요."
          showIcon={true}
          defaultValue="제주도 여행"
          autoFocus={true}
        />
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Theme Comparison
 * Light와 Dark 테마를 나란히 비교
 */
export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '18px', 
          fontWeight: '600',
          padding: '10px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}>
          Light Theme
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>Default</p>
            <SearchBar size="large" theme="light" placeholder="제목을 검색해 주세요." />
          </div>
          <div>
            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280' }}>Filled</p>
            <SearchBar size="large" theme="light" placeholder="제목을 검색해 주세요." defaultValue="제주도 여행" />
          </div>
        </div>
      </div>
      
      {/* Dark Theme */}
      <div style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px' }}>
        <h3 style={{ 
          marginBottom: '20px', 
          fontSize: '18px', 
          fontWeight: '600',
          padding: '10px',
          backgroundColor: '#374151',
          borderRadius: '8px',
          color: 'white'
        }}>
          Dark Theme
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#9ca3af' }}>Default</p>
            <SearchBar size="large" theme="dark" placeholder="제목을 검색해 주세요." />
          </div>
          <div>
            <p style={{ marginBottom: '8px', fontSize: '12px', color: '#9ca3af' }}>Filled</p>
            <SearchBar size="large" theme="dark" placeholder="제목을 검색해 주세요." defaultValue="제주도 여행" />
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive Playground
 * 모든 속성을 자유롭게 조합해볼 수 있는 대화형 스토리
 */
export const Playground: Story = {
  args: {
    size: 'large',
    theme: 'light',
    placeholder: '제목을 검색해 주세요.',
    showIcon: true,
    disabled: false,
  },
};

/**
 * Complete Matrix
 * 모든 조합 (Size × Theme)을 한눈에 볼 수 있는 완전한 매트릭스
 */
export const CompleteMatrix: Story = {
  render: () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const themes: Array<'light' | 'dark'> = ['light', 'dark'];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>
          완전한 SearchBar 매트릭스 (Size × Theme)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {themes.map((theme) => (
            <div 
              key={theme} 
              style={{ 
                padding: theme === 'dark' ? '20px' : '0',
                backgroundColor: theme === 'dark' ? '#1f2937' : 'transparent',
                borderRadius: theme === 'dark' ? '12px' : '0'
              }}
            >
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '20px', 
                fontWeight: '600',
                textTransform: 'capitalize',
                borderBottom: '2px solid',
                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                paddingBottom: '10px',
                color: theme === 'dark' ? 'white' : 'black'
              }}>
                {theme} Theme
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sizes.map((size) => (
                  <div key={`${theme}-${size}`}>
                    <h4 style={{ 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      textTransform: 'capitalize'
                    }}>
                      {size}
                    </h4>
                    <SearchBar
                      size={size}
                      theme={theme}
                      placeholder="제목을 검색해 주세요."
                      showIcon={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

