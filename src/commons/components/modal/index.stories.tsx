/**
 * Modal Component Stories
 * Design Source: Figma Node IDs 285:30884, 285:32916, 285:32688
 * Last Updated: 2025-01-27
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Modal } from './index';
import React from 'react';

const meta = {
  title: 'Commons/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'danger'],
      description: '모달의 variant (색상 테마)',
    },
    actions: {
      control: 'select',
      options: ['single', 'dual'],
      description: '모달의 액션 버튼 구성',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '모달의 테마',
    },
    title: {
      control: 'text',
      description: '모달 제목',
    },
    description: {
      control: 'text',
      description: '모달 설명',
    },
    showLogo: {
      control: 'boolean',
      description: '로고 표시 여부',
    },
    confirmText: {
      control: 'text',
      description: '확인 버튼 텍스트',
    },
    cancelText: {
      control: 'text',
      description: '취소 버튼 텍스트 (dual 액션일 때만 사용)',
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 버튼 클릭 핸들러',
    },
    onCancel: {
      action: 'cancelled',
      description: '취소 버튼 클릭 핸들러 (dual 액션일 때만 사용)',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Info Modal (Single Action)
 * 가장 기본적인 정보 모달
 */
export const InfoSingle: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: '비밀번호 변경 완료',
    description: '비밀번호가 변경 되었습니다.',
    confirmText: '확인',
    onConfirm: () => console.log('확인'),
  },
};

/**
 * Info Modal (Dual Action)
 * 확인과 취소 버튼이 있는 정보 모달
 */
export const InfoDual: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    theme: 'light',
    title: '변경사항을 저장하시겠습니까?',
    description: '저장하지 않은 변경사항이 있습니다.',
    confirmText: '저장',
    cancelText: '취소',
    onConfirm: () => console.log('저장'),
    onCancel: () => console.log('취소'),
  },
};

/**
 * Danger Modal (Single Action)
 * 위험한 작업을 알리는 모달
 */
export const DangerSingle: Story = {
  args: {
    variant: 'danger',
    actions: 'single',
    theme: 'light',
    title: '정말 삭제하시겠습니까?',
    description: '삭제된 데이터는 복구할 수 없습니다.',
    confirmText: '삭제',
    onConfirm: () => console.log('삭제'),
  },
};

/**
 * Danger Modal (Dual Action)
 * 확인과 취소 버튼이 있는 위험 모달
 */
export const DangerDual: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'light',
    title: '정말 삭제하시겠습니까?',
    description: '삭제된 데이터는 복구할 수 없습니다.',
    confirmText: '삭제',
    cancelText: '취소',
    onConfirm: () => console.log('삭제'),
    onCancel: () => console.log('취소'),
  },
};

/**
 * Info Modal with Logo
 * 로고가 있는 정보 모달
 */
export const InfoWithLogo: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: '회원가입 완료',
    description: '트립토크에 오신 것을 환영합니다!',
    showLogo: true,
    confirmText: '시작하기',
    onConfirm: () => console.log('시작하기'),
  },
};

/**
 * Danger Modal with Logo
 * 로고가 있는 위험 모달
 */
export const DangerWithLogo: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'light',
    title: '계정을 삭제하시겠습니까?',
    description: '계정 삭제 시 모든 데이터가 영구적으로 삭제됩니다.',
    showLogo: true,
    confirmText: '삭제',
    cancelText: '취소',
    onConfirm: () => console.log('삭제'),
    onCancel: () => console.log('취소'),
  },
};

/**
 * Dark Theme - Info Modal
 * 다크 테마의 정보 모달
 */
export const DarkInfoSingle: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'dark',
    title: '설정이 저장되었습니다',
    description: '모든 설정이 성공적으로 저장되었습니다.',
    confirmText: '확인',
    onConfirm: () => console.log('확인'),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Dark Theme - Danger Modal
 * 다크 테마의 위험 모달
 */
export const DarkDangerDual: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'dark',
    title: '정말 로그아웃하시겠습니까?',
    description: '현재 세션이 종료됩니다.',
    confirmText: '로그아웃',
    cancelText: '취소',
    onConfirm: () => console.log('로그아웃'),
    onCancel: () => console.log('취소'),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Without Description
 * 설명이 없는 모달
 */
export const WithoutDescription: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: '알림',
    confirmText: '확인',
    onConfirm: () => console.log('확인'),
  },
};

/**
 * Long Description
 * 긴 설명이 있는 모달
 */
export const LongDescription: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    theme: 'light',
    title: '서비스 이용약관 변경 안내',
    description: '더 나은 서비스 제공을 위해 서비스 이용약관이 변경됩니다. 주요 변경사항은 다음과 같습니다: 1) 개인정보 처리방침 업데이트, 2) 서비스 이용 규정 개선, 3) 사용자 권리 보호 강화. 변경된 약관은 2025년 2월 1일부터 적용됩니다.',
    confirmText: '동의',
    cancelText: '거부',
    onConfirm: () => console.log('동의'),
    onCancel: () => console.log('거부'),
  },
};

/**
 * Custom Button Text
 * 사용자 정의 버튼 텍스트가 있는 모달
 */
export const CustomButtonText: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    theme: 'light',
    title: '파일을 업로드하시겠습니까?',
    description: '선택한 파일이 서버에 업로드됩니다.',
    confirmText: '업로드',
    cancelText: '나중에',
    onConfirm: () => console.log('업로드'),
    onCancel: () => console.log('나중에'),
  },
};

/* ========================================
   All Variants Matrix
   ======================================== */

/**
 * All Variants Matrix
 * 모든 Variant × Actions 조합을 한눈에 볼 수 있는 매트릭스
 */
export const AllVariantsMatrix: Story = {
  args: {
    title: 'Modal',
    description: '모달 설명',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const variants: Array<'info' | 'danger'> = ['info', 'danger'];
    const actions: Array<'single' | 'dual'> = ['single', 'dual'];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          모든 Variant × Actions 조합
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {variants.map((variant) => (
            <div key={variant}>
              <h3 style={{ 
                marginBottom: '15px', 
                fontSize: '18px', 
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {variant}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {actions.map((action) => (
                  <div key={`${variant}-${action}`} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: 'white'
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '10px'
                    }}>
                      {action}
                    </span>
                    <Modal
                      variant={variant}
                      actions={action}
                      theme="light"
                      title={`${variant} ${action} 모달`}
                      description="모달 설명입니다."
                      confirmText="확인"
                      cancelText="취소"
                      onConfirm={() => console.log(`${variant} ${action} 확인`)}
                      onCancel={() => console.log(`${variant} ${action} 취소`)}
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

/**
 * All Themes Matrix
 * 모든 테마를 한눈에 볼 수 있는 매트릭스
 */
export const AllThemesMatrix: Story = {
  args: {
    title: 'Modal',
    description: '모달 설명',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const themes: Array<'light' | 'dark'> = ['light', 'dark'];
    const variants: Array<'info' | 'danger'> = ['info', 'danger'];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          모든 테마 비교
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {themes.map((theme) => (
            <div key={theme} style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <h3 style={{ 
                marginBottom: '20px', 
                fontSize: '18px', 
                fontWeight: '600',
                color: theme === 'dark' ? 'white' : 'black'
              }}>
                {theme} Theme
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {variants.map((variant) => (
                  <div key={`${theme}-${variant}`}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      textTransform: 'capitalize',
                      display: 'block',
                      marginBottom: '10px'
                    }}>
                      {variant}
                    </span>
                    <Modal
                      variant={variant}
                      actions="dual"
                      theme={theme}
                      title={`${theme} ${variant} 모달`}
                      description="모달 설명입니다."
                      confirmText="확인"
                      cancelText="취소"
                      onConfirm={() => console.log(`${theme} ${variant} 확인`)}
                      onCancel={() => console.log(`${theme} ${variant} 취소`)}
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

/**
 * All States Matrix
 * 모든 상태를 한눈에 볼 수 있는 매트릭스
 */
export const AllStatesMatrix: Story = {
  args: {
    title: 'Modal',
    description: '모달 설명',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const states = [
      { name: '기본', variant: 'info' as const, actions: 'single' as const, showLogo: false },
      { name: '로고 있음', variant: 'info' as const, actions: 'single' as const, showLogo: true },
      { name: '듀얼 액션', variant: 'info' as const, actions: 'dual' as const, showLogo: false },
      { name: '위험 모달', variant: 'danger' as const, actions: 'dual' as const, showLogo: false },
      { name: '설명 없음', variant: 'info' as const, actions: 'single' as const, showLogo: false, noDescription: true },
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          모든 상태 비교
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {states.map((state, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white'
            }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                display: 'block',
                marginBottom: '15px'
              }}>
                {state.name}
              </span>
              <Modal
                variant={state.variant}
                actions={state.actions}
                theme="light"
                title={`${state.name} 모달`}
                description={state.noDescription ? undefined : '모달 설명입니다.'}
                showLogo={state.showLogo}
                confirmText="확인"
                cancelText="취소"
                onConfirm={() => console.log(`${state.name} 확인`)}
                onCancel={() => console.log(`${state.name} 취소`)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Interactive Playground
 * 모든 속성을 자유롭게 조합해볼 수 있는 대화형 스토리
 */
export const Playground: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'light',
    title: '모달 제목',
    description: '모달 설명을 입력하세요.',
    showLogo: false,
    confirmText: '확인',
    cancelText: '취소',
    onConfirm: () => console.log('확인'),
    onCancel: () => console.log('취소'),
  },
};

/**
 * Real-world Examples
 * 실제 사용 사례를 보여주는 예제들
 */
export const RealWorldExamples: Story = {
  args: {
    title: 'Modal',
    description: '모달 설명',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const examples = [
      {
        title: '회원가입 완료',
        description: '트립토크에 오신 것을 환영합니다!',
        variant: 'info' as const,
        actions: 'single' as const,
        showLogo: true,
        confirmText: '시작하기',
      },
      {
        title: '정말 삭제하시겠습니까?',
        description: '삭제된 데이터는 복구할 수 없습니다.',
        variant: 'danger' as const,
        actions: 'dual' as const,
        showLogo: false,
        confirmText: '삭제',
        cancelText: '취소',
      },
      {
        title: '변경사항을 저장하시겠습니까?',
        description: '저장하지 않은 변경사항이 있습니다.',
        variant: 'info' as const,
        actions: 'dual' as const,
        showLogo: false,
        confirmText: '저장',
        cancelText: '취소',
      },
      {
        title: '알림',
        description: undefined,
        variant: 'info' as const,
        actions: 'single' as const,
        showLogo: false,
        confirmText: '확인',
      },
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          실제 사용 사례
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {examples.map((example, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white'
            }}>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                display: 'block',
                marginBottom: '15px'
              }}>
                예제 {index + 1}
              </span>
              <Modal
                variant={example.variant}
                actions={example.actions}
                theme="light"
                title={example.title}
                description={example.description}
                showLogo={example.showLogo}
                confirmText={example.confirmText}
                cancelText={example.cancelText}
                onConfirm={() => console.log(`${example.title} 확인`)}
                onCancel={() => console.log(`${example.title} 취소`)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
