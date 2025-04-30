import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '../lib/api';
import styles from '../styles/Header.module.css';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    }
    
    loadCategories();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <a>Letter WePickr</a>
        </Link>
      </div>

      <button 
        className={styles.menuButton} 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        메뉴
      </button>

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
