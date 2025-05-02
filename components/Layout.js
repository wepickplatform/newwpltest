import Head from 'next/head';
import Header from './Header';
import styles from '../styles/Layout.module.css';

export default function Layout({ children, title = '워드프레스 헤드리스 사이트' }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="워드프레스 헤드리스 웹사이트" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} 워드프레스 헤드리스 사이트</p>
      </footer>
    </div>
  );
}