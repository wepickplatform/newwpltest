// components/Layout.js
import Header from './Header';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Letter WePickr - 워드프레스 헤드리스 사이트</p>
      </footer>
    </div>
  );
}
