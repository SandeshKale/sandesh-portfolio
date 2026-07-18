'use client';
import { createContext, useContext, useEffect, useState } from 'react';

/* Theme system. CSS variables drive the DOM; PALETTES drive the WebGL scene.
   Dark is the native mode; light is a true re-render, not an inversion. */

const ThemeContext = createContext({ mode: 'dark', toggle: () => {} });

export const PALETTES = {
  dark: {
    fog: '#0B0E15',
    wireA: '#7C96C4',
    wireB: '#F0B34C',
    glass: '#aebfdd',
    attenuation: '#F0B34C',
    marker: '#F0B34C',
    nodeEmissive: '#F0B34C',
    additive: true,
    ambient: 0.3,
    spot: 2.4,
    monolith: '#0d1017',
  },
  light: {
    fog: '#EFEDE6',
    wireA: '#3D5379',
    wireB: '#9A660F',
    glass: '#7c92b8',
    attenuation: '#9A660F',
    marker: '#9A660F',
    nodeEmissive: '#B4791B',
    additive: false,
    ambient: 0.85,
    spot: 1.6,
    monolith: '#20242e',
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('sk-theme');
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', mode === 'light');
    localStorage.setItem('sk-theme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
