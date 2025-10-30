'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Banner from './banner';
import Button from '@/commons/components/button';
import { urls } from '@/commons/constants/url';
import { useNavigationRouting } from './hooks/index.link.routing.hook';
import { useAreaVisibility } from './hooks/index.area.hook';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { activeTab } = useNavigationRouting();
  const { isHeaderVisible, isBannerVisible } = useAreaVisibility();
  const pathname = usePathname();
  const { isLoggedIn: isLoggedInFromAuth, user, logout } = useAuth();
  
  // 바깥 클릭 시 드롭다운 닫기 (항상 훅은 조건부 반환보다 먼저 호출)
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isProfileOpen]);
  
  // auth 페이지들은 레이아웃에서 제외
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <div className={styles.container} data-testid="layout-container">
      {!isAuthPage && isHeaderVisible && (
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
            {isLoggedInFromAuth ? (
              <div
                className={styles.profileContainer}
                ref={profileRef}
              >
                <div className={styles.profileMenu} data-testid="profile-menu">
                  <img
                    src="/images/profile_default.svg"
                    alt="프로필 사진"
                    className={styles.profileImage}
                  />
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                    className={styles.profileArrowButton}
                    onClick={() => setIsProfileOpen((v) => !v)}
                  >
                    <img
                      src={isProfileOpen ? '/icons/up_arrow.svg' : '/icons/down_arrow.svg'}
                      alt={isProfileOpen ? '닫기' : '열기'}
                      className={styles.profileArrow}
                    />
                  </button>
                </div>
                {isProfileOpen && (
                  <div className={styles.profileOverlay} data-testid="profile-overlay">
                    <div className={styles.overlayHeader}>
                      <img src="/images/profile_default.svg" alt="프로필" className={styles.overlayProfileImage} />
                      <span className={styles.overlayUserName}>{user?.name ?? '사용자'}</span>
                      <img src="/icons/up_arrow.svg" alt="닫기" className={styles.overlayArrow} />
                    </div>
                    <div className={styles.menuDivider} />
                    <button type="button" className={styles.overlayItem} onClick={(e) => e.preventDefault()}>
                      <img src="/icons/point.svg" alt="지갑" className={styles.itemIcon} />
                      <span className={styles.itemText}>23,000 P</span>
                    </button>
                    <div className={styles.menuDivider} />
                    <button type="button" className={styles.overlayItem} onClick={(e) => e.preventDefault()}>
                      <img src="/icons/charge.svg" alt="포인트 충전" className={styles.itemIcon} />
                      <span className={styles.itemText}>포인트 충전</span>
                    </button>
                    <button
                      type="button"
                      className={styles.overlayItem}
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      <img src="/icons/logout.svg" alt="로그아웃" className={styles.itemIcon} />
                      <span className={styles.itemText}>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
      
      {!isAuthPage && isBannerVisible && (
        <div className={styles.banner} data-testid="layout-banner">
          <Banner />
        </div>
      )}
      
      {!isAuthPage && (
      <div className={styles.gap}>
        {/* Gap 영역 (빈 공간) */}
      </div>
      )}
      
      <main className={styles.children} data-testid="main-content">
        {children}
      </main>
    </div>
  );
}

