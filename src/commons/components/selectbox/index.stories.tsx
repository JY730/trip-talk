/**
 * Selectbox Component Stories
 * Design Source: Figma Node ID 285:40457
 * Last Updated: 2025-10-17
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Selectbox, SelectOption } from './index';
import React, { useState } from 'react';

// Mock data for options
const pointOptions: SelectOption[] = [
  { value: 100, label: '100' },
  { value: 500, label: '500' },
  { value: 2000, label: '2,000' },
  { value: 5000, label: '5,000' },
  { value: 10000, label: '10,000' },
  { value: 50000, label: '50,000' },
];

const categoryOptions: SelectOption[] = [
  { value: 'hotel', label: '호텔' },
  { value: 'resort', label: '리조트' },
  { value: 'pension', label: '펜션' },
  { value: 'camping', label: '캠핑' },
  { value: 'guesthouse', label: '게스트하우스' },
];

const regionOptions: SelectOption[] = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'jeju', label: '제주' },
  { value: 'gangwon', label: '강원' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'incheon', label: '인천' },
  { value: 'daegu', label: '대구' },
  { value: 'daejeon', label: '대전' },
  { value: 'gwangju', label: '광주' },
  { value: 'ulsan', label: '울산' },
];

const meta = {
  title: 'Commons/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '셀렉트박스의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '셀렉트박스의 테마',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트',
    },
    maxHeight: {
      control: 'number',
      description: '드롭다운 최대 높이 (px) - 지정하지 않으면 스크롤 없이 모든 메뉴 표시',
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default (기본 상태)
 * 아무것도 선택하지 않은 기본 상태
 */
export const Default: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Filled (값이 선택된 상태)
 * 값이 선택되어 있는 상태
 */
export const Filled: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(2000);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Small Size
 * 작은 크기의 셀렉트박스
 */
export const SmallSize: Story = {
  args: {
    options: categoryOptions,
    placeholder: '카테고리 선택',
    size: 'small',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '300px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Medium Size
 * 중간 크기의 셀렉트박스 (기본값)
 */
export const MediumSize: Story = {
  args: {
    options: categoryOptions,
    placeholder: '카테고리 선택',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Large Size
 * 큰 크기의 셀렉트박스
 */
export const LargeSize: Story = {
  args: {
    options: categoryOptions,
    placeholder: '카테고리 선택',
    size: 'large',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '500px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Dark Theme
 * 다크 테마의 셀렉트박스
 */
export const DarkTheme: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
    size: 'medium',
    theme: 'dark',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '400px', padding: '40px', backgroundColor: '#1c1c1c', borderRadius: '8px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Disabled
 * 비활성화된 셀렉트박스
 */
export const Disabled: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(2000);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * Long List (No Scroll)
 * 많은 옵션이 있지만 스크롤 없이 모두 표시
 */
export const LongList: Story = {
  args: {
    options: regionOptions,
    placeholder: '지역 선택',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    );
  },
};

/**
 * All Sizes Matrix
 * 모든 Size 조합을 한눈에 볼 수 있는 매트릭스
 */
export const AllSizesMatrix: Story = {
  args: {
    options: categoryOptions,
    placeholder: '카테고리 선택',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          모든 Size 조합
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {sizes.map((size) => {
            const [value, setValue] = useState<string | number | undefined>(undefined);
            
            return (
              <div key={size}>
                <h3 style={{ 
                  marginBottom: '15px', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {size}
                </h3>
                <div style={{ width: '400px' }}>
                  <Selectbox
                    options={categoryOptions}
                    placeholder={`${size} size`}
                    size={size}
                    theme="light"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * All Themes Matrix
 * Light / Dark 테마 조합
 */
export const AllThemesMatrix: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const themes: Array<'light' | 'dark'> = ['light', 'dark'];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Light / Dark 테마
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {themes.map((theme) => {
            const [value, setValue] = useState<string | number | undefined>(undefined);
            
            const containerStyle = theme === 'dark' 
              ? { padding: '40px', backgroundColor: '#1c1c1c', borderRadius: '8px' }
              : { padding: '40px' };
            
            return (
              <div key={theme} style={containerStyle}>
                <h3 style={{ 
                  marginBottom: '15px', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }}>
                  {theme}
                </h3>
                <div style={{ width: '400px' }}>
                  <Selectbox
                    options={pointOptions}
                    placeholder="내용입력"
                    size="medium"
                    theme={theme}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

/**
 * All States
 * 모든 상태(default, filled, selected) 조합
 */
export const AllStates: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          모든 상태 (Default / Filled)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h3 style={{ 
              marginBottom: '15px', 
              fontSize: '18px', 
              fontWeight: '600',
            }}>
              Default (값 없음)
            </h3>
            <div style={{ width: '400px' }}>
              <Selectbox
                options={pointOptions}
                placeholder="내용입력"
                size="medium"
                theme="light"
                value={undefined}
                onChange={() => {}}
              />
            </div>
          </div>
          
          <div>
            <h3 style={{ 
              marginBottom: '15px', 
              fontSize: '18px', 
              fontWeight: '600',
            }}>
              Filled (값 선택됨)
            </h3>
            <div style={{ width: '400px' }}>
              <Selectbox
                options={pointOptions}
                placeholder="내용입력"
                size="medium"
                theme="light"
                value={2000}
                onChange={() => {}}
              />
            </div>
          </div>
          
          <div>
            <h3 style={{ 
              marginBottom: '15px', 
              fontSize: '18px', 
              fontWeight: '600',
            }}>
              Disabled
            </h3>
            <div style={{ width: '400px' }}>
              <Selectbox
                options={pointOptions}
                placeholder="내용입력"
                size="medium"
                theme="light"
                value={2000}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Complete Matrix
 * 모든 조합 (Size × Theme × State)을 한눈에 볼 수 있는 완전한 매트릭스
 */
export const CompleteMatrix: Story = {
  args: {
    options: pointOptions,
    placeholder: '내용입력',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const themes: Array<'light' | 'dark'> = ['light', 'dark'];
    const states: Array<{ label: string; value: string | number | undefined }> = [
      { label: 'Default', value: undefined },
      { label: 'Filled', value: 2000 },
    ];
    
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          전체 조합 매트릭스 (Size × Theme × State)
        </h2>
        
        {themes.map((theme) => (
          <div 
            key={theme} 
            style={{ 
              marginBottom: '40px',
              padding: '30px',
              backgroundColor: theme === 'dark' ? '#1c1c1c' : '#ffffff',
              borderRadius: '12px'
            }}
          >
            <h3 style={{ 
              marginBottom: '20px', 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              textTransform: 'capitalize'
            }}>
              {theme} Theme
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {sizes.map((size) => (
                <div key={`${theme}-${size}`}>
                  <h4 style={{ 
                    marginBottom: '15px', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: theme === 'dark' ? '#e4e4e4' : '#333333',
                    textTransform: 'capitalize'
                  }}>
                    {size}
                  </h4>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {states.map((state) => (
                      <div key={`${theme}-${size}-${state.label}`}>
                        <p style={{ 
                          marginBottom: '8px', 
                          fontSize: '12px',
                          color: theme === 'dark' ? '#ababab' : '#777777'
                        }}>
                          {state.label}
                        </p>
                        <div style={{ width: '300px' }}>
                          <Selectbox
                            options={pointOptions}
                            placeholder="내용입력"
                            size={size}
                            theme={theme}
                            value={state.value}
                            onChange={() => {}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * With Max Height (Scroll Enabled)
 * maxHeight를 지정하여 스크롤이 필요한 경우
 */
export const WithMaxHeight: Story = {
  args: {
    options: regionOptions,
    placeholder: '지역 선택 (스크롤 가능)',
    size: 'medium',
    theme: 'light',
    maxHeight: 200,
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ width: '400px' }}>
        <Selectbox
          {...args}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#777777' }}>
          maxHeight: 200px로 제한하여 스크롤 가능
        </p>
      </div>
    );
  },
};

/**
 * Interactive Playground
 * 실제로 동작하는 셀렉트박스 체험
 */
export const InteractivePlayground: Story = {
  args: {
    options: pointOptions,
    placeholder: '선택해주세요',
  },
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const [point, setPoint] = useState<string | number | undefined>(undefined);
    const [category, setCategory] = useState<string | number | undefined>(undefined);
    const [region, setRegion] = useState<string | number | undefined>(undefined);
    
    return (
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>
          Interactive Playground
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#333333'
            }}>
              포인트 충전 금액
            </label>
            <Selectbox
              options={pointOptions}
              placeholder="금액을 선택해주세요"
              size="large"
              theme="light"
              value={point}
              onChange={(value) => setPoint(value)}
            />
            {point && (
              <p style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#2974e5'
              }}>
                선택된 금액: {point}P
              </p>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#333333'
            }}>
              숙소 카테고리
            </label>
            <Selectbox
              options={categoryOptions}
              placeholder="카테고리를 선택해주세요"
              size="medium"
              theme="light"
              value={category}
              onChange={(value) => setCategory(value)}
            />
            {category && (
              <p style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#2974e5'
              }}>
                선택된 카테고리: {categoryOptions.find(opt => opt.value === category)?.label}
              </p>
            )}
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#333333'
            }}>
              지역 (스크롤 없이 모두 표시)
            </label>
            <Selectbox
              options={regionOptions}
              placeholder="지역을 선택해주세요"
              size="small"
              theme="light"
              value={region}
              onChange={(value) => setRegion(value)}
            />
            {region && (
              <p style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#2974e5'
              }}>
                선택된 지역: {regionOptions.find(opt => opt.value === region)?.label}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
};

