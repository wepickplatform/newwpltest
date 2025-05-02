// components/UserInfo.js
import { useAuth } from '../lib/auth';
import styles from '../styles/UserInfo.module.css';

export default function UserInfo() {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <span className={styles.username}>{user.username}</span>님 환영합니다
      </div>
      <button 
        onClick={logout}
        className={styles.logoutButton}
      >
        로그아웃
      </button>
    </div>
  );
}
