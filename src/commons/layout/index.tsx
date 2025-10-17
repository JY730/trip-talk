'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Banner from './banner';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const [isLoggedIn] = useState(false); // 로그인 상태 관리 (추후 연동)
  
  // 현재 경로에 따라 activeTab 결정
  const getActiveTab = () => {
    if (pathname?.startsWith('/triptalk')) return 'triptalk';
    if (pathname?.startsWith('/purchase')) return 'purchase';
    if (pathname?.startsWith('/mypage')) return 'mypage';
    return 'triptalk'; // 기본값
  };
  
  const activeTab = getActiveTab();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logo}>
              <img 
                src="/images/logo.svg" 
                alt="TripTalk Logo" 
                className={styles.logoImage}
              />
            </Link>
            
            <nav className={styles.navigation}>
              <Link 
                href="/triptalk" 
                className={`${styles.navLink} ${activeTab === 'triptalk' ? styles.navLinkActive : ''}`}
              >
                트립토크
              </Link>
              <Link 
                href="/purchase" 
                className={`${styles.navLink} ${activeTab === 'purchase' ? styles.navLinkActive : ''}`}
              >
                숙박권 구매
              </Link>
              <Link 
                href="/mypage" 
                className={`${styles.navLink} ${activeTab === 'mypage' ? styles.navLinkActive : ''}`}
              >
                마이 페이지
              </Link>
            </nav>
          </div>
          
          {!isLoggedIn && (
            <Link href="/login" className={styles.loginButtonLink}>
              <Button
                variant="secondary"
                styleType="filled"
                size="medium"
                theme="light"
                shape="rounded"
                rightIcon={
                  <img 
                    src="/icons/right_arrow.svg" 
                    alt="" 
                    className={styles.arrowIcon}
                  />
                }
              >
                로그인
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <div className={styles.banner}>
        <Banner />
      </div>
      
      <div className={styles.gap}>
        {/* Gap 영역 (빈 공간) */}
      </div>
      
      <main className={styles.children}>
        {children}
      </main>
    </div>
  );
}

