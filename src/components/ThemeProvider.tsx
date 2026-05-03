'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// setTheme와 toggleTheme 둘 다 지원하도록 타입 변경
type ThemeContextType = {
  theme: string;
  setTheme: (newTheme: string) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 및 초기 테마 깜빡임 방지
  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      const savedTheme = localStorage.getItem('systema-theme') || 'dark';
      setThemeState(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    });
  }, []);

  // 외부에서 특정 테마로 명시적 지정 (예: Part3 버튼)
  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('systema-theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // 현재 테마의 반대 상태로 스위칭 (예: page.tsx, NavBar 등)
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden', minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
