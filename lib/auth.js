// lib/auth.js 간소화된 버전
import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';

// 인증 컨텍스트 생성
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 초기 로드 시 쿠키에서 사용자 확인
  useEffect(() => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 오류:', error);
        Cookies.remove('user');
      }
    }
  }, []);
  
  // 간소화된 로그인 함수
  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // 간단한 유효성 검사
      if (!username || !password) {
        throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
      }
      
      // 간단한 모의 사용자 객체 생성
      const userData = {
        id: 1,
        username: username,
        email: `${username}@example.com`,
      };
      
      // 사용자 정보 쿠키에 저장 (7일 유효)
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
      
      // 상태 업데이트
      setUser(userData);
      
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
    Cookies.remove('user');
    setUser(null);
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
