import { create } from 'zustand';

export const usePortfolioStore = create((set) => ({
  holdings: [],
  totalValue: 0,
  totalInvested: 0,
  gainLoss: 0,
  gainLossPercent: 0,

  addHolding: (holding) => set((state) => ({
    holdings: [...state.holdings, holding],
  })),

  removeHolding: (id) => set((state) => ({
    holdings: state.holdings.filter((h) => h.id !== id),
  })),

  updateHolding: (id, updates) => set((state) => ({
    holdings: state.holdings.map((h) => (h.id === id ? { ...h, ...updates } : h)),
  })),

  setHoldings: (holdings) => set({ holdings }),

  updateTotals: (totals) => set(totals),

  clearPortfolio: () => set({
    holdings: [],
    totalValue: 0,
    totalInvested: 0,
    gainLoss: 0,
    gainLossPercent: 0,
  }),
}));
