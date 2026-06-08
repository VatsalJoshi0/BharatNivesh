import { create } from 'zustand';

export const useAppStore = create((set) => ({
  mode: 'regular',
  language: 'en',
  theme: 'light',

  setMode: (mode) => {
    localStorage.setItem('bharatnivesh_mode', mode);
    set({ mode });
  },

  setLanguage: (language) => {
    localStorage.setItem('bharatnivesh_language', language);
    set({ language });
  },

  setTheme: (theme) => {
    localStorage.setItem('bharatnivesh_theme', theme);
    set({ theme });
  },

  restorePreferences: () => {
    const mode = localStorage.getItem('bharatnivesh_mode') || 'regular';
    const language = localStorage.getItem('bharatnivesh_language') || 'en';
    const theme = localStorage.getItem('bharatnivesh_theme') || 'light';
    set({ mode, language, theme });
  },
}));
