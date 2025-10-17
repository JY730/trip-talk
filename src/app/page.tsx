import Button from '@/commons/components/button';

export default function Home() {
  const variants: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];
  const styleTypes: Array<'filled' | 'outline' | 'transparent'> = ['filled', 'outline', 'transparent'];
  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

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
                variant="primary" 
                styleType="filled" 
                size="large"
                leftIcon={<img src="/icons/add.svg" alt="" style={{ width: '24px', height: '24px' }} />}
              >
                추가하기
              </Button>
              <Button 
                variant="secondary" 
                styleType="outline" 
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
              color: 'var(--color-gray-600)'
            }}>
              Right Icon
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button 
                variant="primary" 
                styleType="filled" 
                size="large"
                rightIcon={<img src="/icons/right_arrow.svg" alt="" style={{ width: '24px', height: '24px' }} />}
              >
                다음
              </Button>
              <Button 
                variant="tertiary" 
                styleType="filled" 
                size="medium"
                theme="dark"
                rightIcon={<img src="/icons/right_arrow.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />}
              >
                로그인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
