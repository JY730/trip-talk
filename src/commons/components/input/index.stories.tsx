/**
 * Input Component Stories
 * Design Source: Figma Node IDs 285:31852, 285:31825
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Input } from './index';
import React from 'react';

// Mock Button Component for demonstration
const MockButton = ({ children }: { children: React.ReactNode }) => (
  <button
    style={{
      height: '48px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #000000',
      backgroundColor: '#ffffff',
      fontSize: '18px',
      fontWeight: 600,
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const meta = {
  title: 'Commons/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Input의 variant (색상 테마)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Input의 테마',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    disabled: {
      control: 'boolean',
      description: 'Input 비활성화 여부',
    },
    label: {
      control: 'text',
      description: '레이블 텍스트',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 표시',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder 텍스트',
    },
    rightButton: {
      control: false,
      description: '오른쪽 버튼',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary Input (Large)
 * 가장 기본적인 Primary Input
 */
export const PrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    label: '상품명',
    placeholder: '상품명을 입력해 주세요.',
    required: true,
  },
};

/**
 * Primary Input (Large) - Error State
 * 에러 상태의 Input
 */
export const PrimaryLargeError: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    label: '이메일',
    placeholder: '이메일을 입력해 주세요.',
    required: true,
    error: true,
    errorMessage: '올바른 이메일 주소를 입력해주세요.',
  },
};

/**
 * Primary Input (Large) - Disabled
 * 비활성화 상태의 Input
 */
export const PrimaryLargeDisabled: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    label: '위도(LAT)',
    placeholder: '주소를 먼저 입력해 주세요.',
    required: true,
    disabled: true,
  },
};

/**
 * Primary Input (Large) - With Right Button
 * 오른쪽 버튼이 있는 Input
 */
export const PrimaryLargeWithButton: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    label: '주소',
    placeholder: '01234',
    required: true,
    rightButton: <MockButton>우편번호 검색</MockButton>,
  },
};

/**
 * Primary Input (Medium)
 * Medium 크기의 Input
 */
export const PrimaryMedium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    label: '제목',
    placeholder: '제목을 입력해 주세요.',
    required: false,
  },
};

/**
 * Primary Input (Small)
 * Small 크기의 Input
 */
export const PrimarySmall: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    theme: 'light',
    label: '검색',
    placeholder: '검색어를 입력하세요',
    required: false,
  },
};

/**
 * Secondary Input (Large)
 * Secondary variant의 Input
 */
export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    theme: 'light',
    label: '한줄 요약',
    placeholder: '상품을 한줄로 요약해 주세요.',
    required: true,
  },
};

/**
 * Tertiary Input (Large)
 * Tertiary variant의 Input
 */
export const TertiaryLarge: Story = {
  args: {
    variant: 'tertiary',
    size: 'large',
    theme: 'light',
    label: '태그 입력',
    placeholder: '태그를 입력해 주세요.',
    required: false,
  },
};

/**
 * Dark Theme - Primary Input (Large)
 * 다크 테마의 Primary Input
 */
export const DarkPrimaryLarge: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'dark',
    label: '상품명',
    placeholder: '상품명을 입력해 주세요.',
    required: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Secondary Input (Large)
 * 다크 테마의 Secondary Input
 */
export const DarkSecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    theme: 'dark',
    label: '한줄 요약',
    placeholder: '상품을 한줄로 요약해 주세요.',
    required: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Without Label
 * 레이블이 없는 Input
 */
export const WithoutLabel: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    placeholder: '레이블 없는 입력창',
  },
};

/**
 * All Size Variants
 * 모든 크기의 Input을 한눈에 확인
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <Input
        variant="primary"
        size="small"
        theme="light"
        label="Small"
        placeholder="Small 크기"
      />
      <Input
        variant="primary"
        size="medium"
        theme="light"
        label="Medium"
        placeholder="Medium 크기"
      />
      <Input
        variant="primary"
        size="large"
        theme="light"
        label="Large"
        placeholder="Large 크기"
      />
    </div>
  ),
};

/**
 * All Variants
 * 모든 variant를 한눈에 확인
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <Input
        variant="primary"
        size="large"
        theme="light"
        label="Primary"
        placeholder="Primary variant"
        required
      />
      <Input
        variant="secondary"
        size="large"
        theme="light"
        label="Secondary"
        placeholder="Secondary variant"
        required
      />
      <Input
        variant="tertiary"
        size="large"
        theme="light"
        label="Tertiary"
        placeholder="Tertiary variant"
        required
      />
    </div>
  ),
};

/**
 * All States
 * 모든 상태를 한눈에 확인
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '400px' }}>
      <Input
        variant="primary"
        size="large"
        theme="light"
        label="Default"
        placeholder="기본 상태"
        required
      />
      <Input
        variant="primary"
        size="large"
        theme="light"
        label="Error"
        placeholder="에러 상태"
        required
        error
        errorMessage="올바른 값을 입력해주세요."
      />
      <Input
        variant="primary"
        size="large"
        theme="light"
        label="Disabled"
        placeholder="비활성화 상태"
        required
        disabled
      />
    </div>
  ),
};

/**
 * Interactive Playground
 * 모든 조합을 자유롭게 테스트할 수 있는 Playground
 */
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    label: '레이블',
    placeholder: 'Playground에서 자유롭게 테스트하세요',
    required: true,
    error: false,
    disabled: false,
    errorMessage: '에러 메시지입니다.',
  },
};

