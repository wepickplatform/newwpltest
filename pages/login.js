// pages/login.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../lib/auth';
import styles from '../styles/Login.module.css';

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;
  
  useEffect(() => {
    // 이미 로그인한 경우 리다이렉트
    if (isAuthenticated && !loading) {
      router.push(redirect || '/');
    }
  }, [isAuthenticated, loading, redirect, router]);
  
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <LoginForm />
        <div className={styles.links}>
          <Link href="/">
            <a className={styles.link}>홈으로 돌아가기</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
