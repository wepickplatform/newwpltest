// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '../lib/api';
import { useAuth } from '../lib/auth';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  
  useEffect(() => {
    async function loadCategories() {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    }
    
    loadCategories();
  }, []);
  
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Link href="/">
            <a>Letter WePickr</a>
          </Link>
        </div>
        
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
          >
            메뉴
          </button>
        </div>
      </div>
      
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link href="/">
              <a>홈</a>
            </Link>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <Link href={`/category/${category.slug}`}>
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
