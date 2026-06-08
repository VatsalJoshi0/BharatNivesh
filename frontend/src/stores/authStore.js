import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user, token) => set({
    user,
    token,
    isAuthenticated: !!token,
    error: null,
  }),

  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  restoreAuth: () => {
    const stored = localStorage.getItem('bharatnivesh_auth');
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        set({ user, token, isAuthenticated: !!token });
      } catch (e) {
        console.error('Failed to restore auth:', e);
      }
    }
  },
}));

// Persist auth state to localStorage
useAuthStore.subscribe((state) => {
  if (state.token) {
    localStorage.setItem('bharatnivesh_auth', JSON.stringify({ user: state.user, token: state.token }));
  } else {
    localStorage.removeItem('bharatnivesh_auth');
  }
});
