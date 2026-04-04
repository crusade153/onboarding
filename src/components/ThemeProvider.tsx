'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 및 초기 테마 깜빡임 방지
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('systema-theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('systema-theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // 해결된 부분: Provider는 조건에 상관없이 항상 최상단을 감싸야 합니다!
  // 마운트되기 전에는 내용물만 hidden 처리하여 깜빡임을 방지합니다.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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