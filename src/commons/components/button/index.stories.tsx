/**
 * Button Component Stories
 * Design Source: Figma Node IDs 285:32278, 285:32417, 285:32418, 285:32025, 285:33448
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './index';

// Mock Icon Components for demonstration
const BookmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const meta = {
  title: 'Commons/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼의 variant (색상 테마)',
    },
    styleType: {
      control: 'select',
      options: ['filled', 'outline', 'transparent'],
      description: '버튼의 스타일 (배경 처리 방식)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '버튼의 테마',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
    leftIcon: {
      control: false,
      description: '왼쪽 아이콘',
    },
    rightIcon: {
      control: false,
      description: '오른쪽 아이콘',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary Filled Button (Large)
 * 가장 기본적인 Primary 버튼
 */
export const PrimaryFilledLarge: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    children: '트립토크 등록',
  },
};

/**
 * Secondary Outline Button (Large)
 * 보조 액션을 위한 Outline 버튼
 */
export const SecondaryOutlineLarge: Story = {
  args: {
    variant: 'secondary',
    styleType: 'outline',
    size: 'large',
    theme: 'light',
    children: '취소',
  },
};

/**
 * Tertiary Transparent Button (Small)
 * 아이콘과 함께 사용되는 투명 버튼
 */
export const TertiaryTransparentSmall: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'transparent',
    size: 'small',
    theme: 'light',
    children: '24',
  },
};

/**
 * Primary Filled Button (Medium)
 */
export const PrimaryFilledMedium: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'medium',
    theme: 'light',
    children: '확인',
  },
};

/**
 * Primary Filled Button (Small)
 */
export const PrimaryFilledSmall: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'small',
    theme: 'light',
    children: '저장',
  },
};

/**
 * Primary Outline Button
 */
export const PrimaryOutline: Story = {
  args: {
    variant: 'primary',
    styleType: 'outline',
    size: 'large',
    theme: 'light',
    children: '다음',
  },
};

/**
 * Secondary Filled Button
 */
export const SecondaryFilled: Story = {
  args: {
    variant: 'secondary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    children: '취소',
  },
};

/**
 * Tertiary Filled Button
 */
export const TertiaryFilled: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    children: '더보기',
  },
};

/**
 * Disabled Button
 * 비활성화된 상태의 버튼
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    children: '비활성화',
    disabled: true,
  },
};

/**
 * Dark Theme Button
 */
export const DarkTheme: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'dark',
    children: '다크 모드',
  },
};

/* ========================================
   Additional Variant Combinations
   ======================================== */

/**
 * Secondary Transparent Button
 * Secondary variant의 Transparent 스타일
 */
export const SecondaryTransparent: Story = {
  args: {
    variant: 'secondary',
    styleType: 'transparent',
    size: 'large',
    theme: 'light',
    children: '보조 투명',
  },
};

/**
 * Tertiary Outline Button
 * Tertiary variant의 Outline 스타일
 */
export const TertiaryOutline: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'outline',
    size: 'large',
    theme: 'light',
    children: '더보기',
  },
};

/**
 * Tertiary Transparent Button
 * Tertiary variant의 Transparent 스타일
 */
export const TertiaryTransparent: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'transparent',
    size: 'large',
    theme: 'light',
    children: '투명 버튼',
  },
};

/* ========================================
   Buttons with Icons
   ======================================== */

/**
 * Button with Left Icon
 * 왼쪽 아이콘이 있는 버튼
 */
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    leftIcon: <PlusIcon />,
    children: '추가하기',
  },
};

/**
 * Button with Right Icon
 * 오른쪽 아이콘이 있는 버튼
 */
export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    rightIcon: <ArrowRightIcon />,
    children: '다음',
  },
};

/**
 * Button with Both Icons
 * 양쪽 아이콘이 있는 버튼
 */
export const WithBothIcons: Story = {
  args: {
    variant: 'secondary',
    styleType: 'outline',
    size: 'large',
    theme: 'light',
    leftIcon: <BookmarkIcon />,
    rightIcon: <ArrowRightIcon />,
    children: '북마크',
  },
};

/**
 * Small Button with Left Icon
 * 작은 크기의 아이콘 버튼
 */
export const SmallWithLeftIcon: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'transparent',
    size: 'small',
    theme: 'light',
    leftIcon: <BookmarkIcon />,
    children: '24',
  },
};

/**
 * Medium Button with Right Icon
 * 중간 크기의 아이콘 버튼
 */
export const MediumWithRightIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'outline',
    size: 'medium',
    theme: 'light',
    rightIcon: <ArrowRightIcon />,
    children: '계속하기',
  },
};

/* ========================================
   All Size Variations
   ======================================== */

/**
 * Secondary Filled (Medium)
 */
export const SecondaryFilledMedium: Story = {
  args: {
    variant: 'secondary',
    styleType: 'filled',
    size: 'medium',
    theme: 'light',
    children: '취소',
  },
};

/**
 * Secondary Filled (Small)
 */
export const SecondaryFilledSmall: Story = {
  args: {
    variant: 'secondary',
    styleType: 'filled',
    size: 'small',
    theme: 'light',
    children: '취소',
  },
};

/**
 * Tertiary Filled (Medium)
 */
export const TertiaryFilledMedium: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'filled',
    size: 'medium',
    theme: 'light',
    children: '더보기',
  },
};

/**
 * Tertiary Filled (Small)
 */
export const TertiaryFilledSmall: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'filled',
    size: 'small',
    theme: 'light',
    children: '더보기',
  },
};

/* ========================================
   Dark Theme Variations
   ======================================== */

/**
 * Dark Theme - Secondary Outline
 */
export const DarkSecondaryOutline: Story = {
  args: {
    variant: 'secondary',
    styleType: 'outline',
    size: 'large',
    theme: 'dark',
    children: '취소',
  },
};

/**
 * Dark Theme - Tertiary Filled
 */
export const DarkTertiaryFilled: Story = {
  args: {
    variant: 'tertiary',
    styleType: 'filled',
    size: 'large',
    theme: 'dark',
    children: '더보기',
  },
};

/**
 * Dark Theme - With Icon
 */
export const DarkWithIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'dark',
    leftIcon: <PlusIcon />,
    children: '추가하기',
  },
};

/* ========================================
   Interactive Playground
   ======================================== */

/**
 * Playground
 * 모든 속성을 자유롭게 조합해볼 수 있는 대화형 스토리
 */
export const Playground: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'large',
    theme: 'light',
    children: '버튼 텍스트',
    disabled: false,
  },
};

