/**
 * Button Component Stories
 * Design Source: Figma Node IDs 285:32278, 285:32417, 285:32418, 285:32025, 285:33448
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from './index';

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

