'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Banner from './banner';
import Button from '@/commons/components/button';
import { urls } from '@/commons/constants/url';
import { useNavigationRouting } from './hooks/index.link.routing.hook';
import { useAreaVisibility } from './hooks/index.area.hook';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoggedIn] = useState(false); // 로그인 상태 관리 (추후 연동)
  const { activeTab } = useNavigationRouting();
  const { isHeaderVisible, isBannerVisible } = useAreaVisibility();
  
  return (
    <div className={styles.container} data-testid="layout-container">
      {isHeaderVisible && (
        <header className={styles.header} data-testid="layout-header">
          <div className={styles.headerInner}>
            <div className={styles.leftSection}>
              <Link href={urls.boards.list()} className={styles.logo} data-testid="logo-link">
                <img 
                  src="/images/logo.svg" 
                  alt="TripTalk Logo" 
                  className={styles.logoImage}
                />
              </Link>
              
              <nav className={styles.navigation} data-testid="navigation">
                <Link 
                  href={urls.boards.list()} 
                  className={`${styles.navLink} ${activeTab === 'boards' ? styles.navLinkActive : ''}`}
                  data-testid="nav-boards"
                >
                  트립토크
                </Link>
                <Link 
                  href={urls.products.list()} 
                  className={`${styles.navLink} ${activeTab === 'products' ? styles.navLinkActive : ''}`}
                  data-testid="nav-products"
                >
                  숙박권 구매
                </Link>
                <Link 
                  href={urls.mypage.main()} 
                  className={`${styles.navLink} ${activeTab === 'mypage' ? styles.navLinkActive : ''}`}
                  data-testid="nav-mypage"
                >
                  마이 페이지
                </Link>
              </nav>
            </div>
            
            {!isLoggedIn && (
              <Link href={urls.auth.login()} className={styles.loginButtonLink} data-testid="login-link">
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
      )}
      
      {isBannerVisible && (
        <div className={styles.banner} data-testid="layout-banner">
          <Banner />
        </div>
      )}
      
      <div className={styles.gap}>
        {/* Gap 영역 (빈 공간) */}
      </div>
      
      <main className={styles.children} data-testid="main-content">
        {children}
      </main>
    </div>
  );
}

