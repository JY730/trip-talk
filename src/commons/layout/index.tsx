import React from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Header 영역 */}
      </header>
      
      <div className={styles.banner}>
        {/* Banner 영역 */}
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

