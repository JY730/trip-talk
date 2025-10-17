'use client';

import { useState } from 'react';
import Button from '@/commons/components/button';
import Input from '@/commons/components/input';
import Pagination from '@/commons/components/pagination';
import SearchBar from '@/commons/components/searchbar';
import Selectbox from '@/commons/components/selectbox';

export default function Home() {
  const variants: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];
  const styleTypes: Array<'filled' | 'outline' | 'transparent'> = ['filled', 'outline', 'transparent'];
  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Selectbox state
  const [selectedValue, setSelectedValue] = useState<string | number>(100);

  return (
    <div style={{ padding: '40px 0' }}>
      <h1 style={{ 
        marginBottom: '40px', 
        fontSize: '32px', 
        fontWeight: 'bold',
        color: 'var(--color-gray-900)'
      }}>
        공통 컴포넌트 All Variants Matrix
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h2 style={{ 
              marginBottom: '24px', 
              fontSize: '24px', 
              fontWeight: '600',
              textTransform: 'capitalize',
              color: 'var(--color-gray-800)',
              borderBottom: '2px solid var(--color-gray-100)',
              paddingBottom: '12px'
            }}>
              {variant}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {styleTypes.map((styleType) => (
                <div key={`${variant}-${styleType}`}>
                  <h3 style={{ 
                    marginBottom: '16px', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: 'var(--color-gray-600)',
                    textTransform: 'capitalize'
                  }}>
                    {styleType}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {sizes.map((size) => (
                      <Button
                        key={`${variant}-${styleType}-${size}`}
                        variant={variant}
                        styleType={styleType}
                        size={size}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--color-gray-100)' }}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: 'var(--color-gray-800)'
        }}>
          아이콘이 있는 버튼
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ 
              marginBottom: '16px', 
              fontSize: '16px', 
              fontWeight: '500',
              color: 'var(--color-gray-600)'
            }}>
              Left Icon
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button 
                variant="secondary" 
                styleType="outline" 
                size="large"
                leftIcon={<img src="/icons/add.svg" alt="" style={{ width: '24px', height: '24px' }} />}
              >
                추가하기
              </Button>
              <Button 
                variant="tertiary" 
                styleType="filled" 
                size="large"
                leftIcon={<img src="/icons/search.svg" alt="" style={{ width: '24px', height: '24px' }} />}
              >
                검색
              </Button>
            </div>
          </div>
          
          <div>
            <h3 style={{ 
              marginBottom: '16px', 
              fontSize: '16px', 
              fontWeight: '500',
              color: 'var(--color-gray-100)'
            }}>
              Right Icon
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button 
                variant="secondary" 
                styleType="filled" 
                size="large"
                rightIcon={<img src="/icons/right_arrow.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />}
              >
                다음
              </Button>
              <Button 
                variant="primary" 
                styleType="filled" 
                size="medium"
                theme="light"
                rightIcon={<img src="/icons/right_arrow.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />}
              >
                로그인
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Input 컴포넌트 */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--color-gray-100)' }}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: 'var(--color-gray-800)'
        }}>
          Input 컴포넌트
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {variants.map((variant) => (
            <div key={`input-${variant}`}>
              <h3 style={{ 
                marginBottom: '16px', 
                fontSize: '16px', 
                fontWeight: '500',
                color: 'var(--color-gray-600)',
                textTransform: 'capitalize'
              }}>
                {variant}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sizes.map((size) => (
                  <Input
                    key={`input-${variant}-${size}`}
                    variant={variant}
                    size={size}
                    label={`${variant} ${size} input`}
                    placeholder="텍스트를 입력해주세요"
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div>
            <h3 style={{ 
              marginBottom: '16px', 
              fontSize: '16px', 
              fontWeight: '500',
              color: 'var(--color-gray-600)'
            }}>
              에러 상태
            </h3>
            <Input
              variant="primary"
              size="large"
              label="이메일"
              placeholder="이메일을 입력해주세요"
              error
              errorMessage="올바른 이메일 주소를 입력해주세요."
              required
            />
          </div>
        </div>
      </div>

      {/* SearchBar 컴포넌트 */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--color-gray-100)' }}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: 'var(--color-gray-800)'
        }}>
          SearchBar 컴포넌트
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sizes.map((size) => (
            <div key={`searchbar-${size}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: 'var(--color-gray-600)',
                textTransform: 'capitalize'
              }}>
                {size}
              </h3>
              <SearchBar
                size={size}
                placeholder="제목을 검색해 주세요."
                onSearch={(value) => console.log('Search:', value)}
              />
            </div>
          ))}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '500',
              color: 'var(--color-gray-600)'
            }}>
              Dark Theme
            </h3>
            <div style={{ backgroundColor: 'var(--color-gray-800)', padding: '20px', borderRadius: '8px' }}>
              <SearchBar
                size="large"
                theme="dark"
                placeholder="제목을 검색해 주세요."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selectbox 컴포넌트 */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--color-gray-100)' }}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: 'var(--color-gray-800)'
        }}>
          Selectbox 컴포넌트
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sizes.map((size) => (
            <div key={`selectbox-${size}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: 'var(--color-gray-600)',
                textTransform: 'capitalize'
              }}>
                {size}
              </h3>
              <Selectbox
                size={size}
                options={[
                  { value: 100, label: '100' },
                  { value: 500, label: '500' },
                  { value: 1000, label: '1,000' },
                  { value: 2000, label: '2,000' },
                  { value: 5000, label: '5,000' },
                ]}
                value={selectedValue}
                onChange={(value) => setSelectedValue(value)}
                placeholder="선택해주세요"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination 컴포넌트 */}
      <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--color-gray-100)' }}>
        <h2 style={{ 
          marginBottom: '24px', 
          fontSize: '24px', 
          fontWeight: '600',
          color: 'var(--color-gray-800)'
        }}>
          Pagination 컴포넌트
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {variants.map((variant) => (
            <div key={`pagination-${variant}`}>
              <h3 style={{ 
                marginBottom: '16px', 
                fontSize: '16px', 
                fontWeight: '500',
                color: 'var(--color-gray-600)',
                textTransform: 'capitalize'
              }}>
                {variant}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sizes.map((size) => (
                  <div key={`pagination-${variant}-${size}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', textTransform: 'capitalize' }}>
                      {size}
                    </span>
                    <Pagination
                      variant={variant}
                      size={size}
                      currentPage={currentPage}
                      totalPages={10}
                      onPageChange={(page) => setCurrentPage(page)}
                      maxPageButtons={5}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
