// lib/auth.js
import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';

// 인증 API URL (JWT 플러그인이 설치되어 있어야 함)
const AUTH_API_URL = 'https://letter.wepick.kr/wp-json/jwt-auth/v1';

// 인증 컨텍스트 생성
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 초기 로드 시 쿠키에서 토큰 확인
  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const userData = await validateToken(token);
          setUser(userData);
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          Cookies.remove('auth_token');
        }
      }
      setLoading(false);
    }
    
    loadUserFromCookies();
  }, []);
  
  // 로그인 함수
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${AUTH_API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }
      
      // 토큰을 쿠키에 저장 (7일 유효)
      Cookies.set('auth_token', data.token, { expires: 7 });
      
      // 사용자 정보 설정
      setUser({
        id: data.user_id,
        username: data.user_display_name,
        email: data.user_email,
        token: data.token
      });
      
      return true;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // 로그아웃 함수
  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
  };
  
  // 토큰 검증 함수
  const validateToken = async (token) => {
    const response = await fetch(`${AUTH_API_URL}/token/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('토큰이 유효하지 않습니다.');
    }
    
    return {
      id: data.user_id,
      username: data.user_display_name,
      email: data.user_email,
      token
    };
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!user, 
        user, 
        login, 
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 인증 컨텍스트 사용을 위한 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
