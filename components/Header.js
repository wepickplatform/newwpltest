// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '../lib/api';
import { useAuth } from '../lib/auth';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  
  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('카테고리 로딩 오류:', error);
      }
    }
    
    loadCategories();
    
    // 스크롤 이벤트 리스너 추가
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <Image 
                src="/images/logo.png" 
                alt="Letter WePickr 로고" 
                width={150} 
                height={40} 
                priority
              />
            </a>
          </Link>
        </div>
        
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">
                <a>홈</a>
              </Link>
            </li>
            {categories.map(category => (
              <li key={category.id} className={styles.navItem}>
                <Link href={`/category/${category.slug}`}>
                  <a>{category.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={styles.headerRight}>
          {!loading && (
            isAuthenticated ? (
              <div className={styles.userInfo}>
                <span className={styles.username}>{user.username}</span>님
                <button 
                  onClick={logout}
                  className={styles.logoutButton}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login">
                <a className={styles.loginButton}>로그인</a>
              </Link>
            )
          )}
          
          <button 
            className={styles.menuButton} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴 열기"
          >
            <span className={`${styles.menuIcon} ${menuOpen ? styles.active : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* 모바일 메뉴 */}
      <div className={`${styles.mobileNav} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          <li className={styles.mobileNavItem}>
            <Link href="/">
              <a>홈</a>
            </Link>
          </li>
          {categories.map(category => (
            <li key={category.id} className={styles.mobileNavItem}>
              <Link href={`/category/${category.slug}`}>
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
          <li className={styles.mobileNavItem}>
            {isAuthenticated ? (
              <button onClick={logout} className={styles.mobileLogoutButton}>
                로그아웃
              </button>
            ) : (
              <Link href="/login">
                <a className={styles.mobileLoginButton}>로그인</a>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
