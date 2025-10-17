/**
 * Pagination Component Stories
 * Design Source: Figma Node IDs
 *   - Primary: 9108:12975
 *   - Secondary: 9108:13141
 *   - Tertiary: 9108:13157
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Pagination } from './index';
import React, { useState } from 'react';

const meta = {
  title: 'Commons/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '페이지네이션의 variant (색상 테마)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '페이지네이션의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '페이지네이션의 테마',
    },
    currentPage: {
      control: 'number',
      description: '현재 페이지 번호 (1부터 시작)',
    },
    totalPages: {
      control: 'number',
      description: '전체 페이지 수',
    },
    maxPageButtons: {
      control: 'number',
      description: '표시할 최대 페이지 버튼 수',
    },
    disablePrevious: {
      control: 'boolean',
      description: '이전 버튼 비활성화',
    },
    disableNext: {
      control: 'boolean',
      description: '다음 버튼 비활성화',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary Pagination (Medium)
 * 가장 기본적인 Primary 페이지네이션
 */
export const PrimaryMedium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 1,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Primary Pagination - Middle Page
 * 중간 페이지를 선택한 상태
 */
export const PrimaryMiddlePage: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 5,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Primary Pagination - Last Page
 * 마지막 페이지를 선택한 상태
 */
export const PrimaryLastPage: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 10,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Secondary Pagination (Medium)
 * Secondary variant
 */
export const SecondaryMedium: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Tertiary Pagination (Medium)
 * Tertiary variant with underline style
 */
export const TertiaryMedium: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Small Size Pagination
 * 작은 크기의 페이지네이션
 */
export const SmallSize: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Large Size Pagination
 * 큰 크기의 페이지네이션
 */
export const LargeSize: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Dark Theme Pagination
 * 다크 테마 페이지네이션
 */
export const DarkTheme: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Secondary
 * 다크 테마 + Secondary variant
 */
export const DarkThemeSecondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'dark',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Tertiary
 * 다크 테마 + Tertiary variant
 */
export const DarkThemeTertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'dark',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Many Pages Pagination
 * 많은 페이지를 가진 페이지네이션 (7개 버튼)
 */
export const ManyPages: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 10,
    totalPages: 50,
    maxPageButtons: 7,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Few Pages Pagination
 * 적은 페이지를 가진 페이지네이션
 */
export const FewPages: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 2,
    totalPages: 3,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Single Page
 * 단일 페이지 (페이지네이션이 거의 필요 없는 경우)
 */
export const SinglePage: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 1,
    totalPages: 1,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Disabled Previous Button
 * 이전 버튼이 비활성화된 상태
 */
export const DisabledPrevious: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 1,
    totalPages: 10,
    maxPageButtons: 5,
    disablePrevious: true,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Disabled Next Button
 * 다음 버튼이 비활성화된 상태
 */
export const DisabledNext: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 10,
    totalPages: 10,
    maxPageButtons: 5,
    disableNext: true,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Interactive Pagination
 * 실제 페이지 전환이 동작하는 인터랙티브한 예제
 */
export const Interactive: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    return (
      <div style={{ padding: '40px' }}>
        <Pagination
          {...args}
          currentPage={currentPage}
          onPageChange={(page: number) => {
            setCurrentPage(page);
            console.log('Page changed to:', page);
          }}
        />
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#333' }}>
          Current Page: {currentPage}
        </div>
      </div>
    );
  },
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 1,
    totalPages: 20,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * All Variants Comparison
 * 모든 variant를 한눈에 비교
 */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px' }}>
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Primary Variant</h3>
        <Pagination
          {...args}
          variant="primary"
          currentPage={3}
          totalPages={10}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Secondary Variant</h3>
        <Pagination
          {...args}
          variant="secondary"
          currentPage={3}
          totalPages={10}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Tertiary Variant</h3>
        <Pagination
          {...args}
          variant="tertiary"
          currentPage={3}
          totalPages={10}
        />
      </div>
    </div>
  ),
  args: {
    size: 'medium',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * All Sizes Comparison
 * 모든 size를 한눈에 비교
 */
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '40px' }}>
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Small Size</h3>
        <Pagination
          {...args}
          size="small"
          currentPage={3}
          totalPages={10}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Medium Size</h3>
        <Pagination
          {...args}
          size="medium"
          currentPage={3}
          totalPages={10}
        />
      </div>
      
      <div>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Large Size</h3>
        <Pagination
          {...args}
          size="large"
          currentPage={3}
          totalPages={10}
        />
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
    theme: 'light',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * All Themes Comparison
 * Light와 Dark 테마 비교
 */
export const AllThemes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ padding: '40px', backgroundColor: '#ffffff' }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Light Theme</h3>
        <Pagination
          {...args}
          theme="light"
          currentPage={3}
          totalPages={10}
        />
      </div>
      
      <div style={{ padding: '40px', backgroundColor: '#1c1c1c' }}>
        <h3 style={{ marginBottom: '16px', color: '#f2f2f2' }}>Dark Theme</h3>
        <Pagination
          {...args}
          theme="dark"
          currentPage={3}
          totalPages={10}
        />
      </div>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'medium',
    currentPage: 3,
    totalPages: 10,
    maxPageButtons: 5,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

/**
 * Responsive Test
 * 반응형 동작 테스트 (화면 크기 조절 시 확인)
 */
export const ResponsiveTest: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
      <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
        * 화면 크기를 조절하여 반응형 동작을 확인하세요.
      </div>
      <Pagination
        {...args}
        currentPage={5}
        totalPages={20}
        maxPageButtons={7}
      />
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    currentPage: 5,
    totalPages: 20,
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
};

