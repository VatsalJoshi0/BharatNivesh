import { create } from 'zustand';

export const useDataStore = create((set) => ({
  ipos: [],
  stocks: [],
  quotes: {},
  news: [],
  indices: {},

  setIpos: (ipos) => set({ ipos }),
  setStocks: (stocks) => set({ stocks }),
  setQuotes: (quotes) => set({ quotes }),
  setNews: (news) => set({ news }),
  setIndices: (indices) => set({ indices }),

  updateQuote: (symbol, quote) => set((state) => ({
    quotes: { ...state.quotes, [symbol]: quote },
  })),

  getQuote: (symbol) => {
    const state = useDataStore.getState();
    return state.quotes[symbol];
  },

  clear: () => set({
    ipos: [],
    stocks: [],
    quotes: {},
    news: [],
    indices: {},
  }),
}));
