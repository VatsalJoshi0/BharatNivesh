# BHARATNIVESH - AI-Powered Indian Investment Platform

> [!IMPORTANT]
> **Prototype & Thought Process Disclaimer:**
> BHARATNIVESH is currently a **functional prototype and conceptual thought process**. Some features use simulated feeds or mock local models to demonstrate user experiences. Certain advanced broker integrations and real-time CDSL demat syncs are structural layouts showcasing the planned product journey.

**Status**: Prototype & Core Functional Pages - COMPLETE ✅

BHARATNIVESH is a comprehensive AI-powered investment platform for Indian retail investors, HNIs, active traders, and institutions. The platform provides a unique Dual-Mode Interface: a simplified, plain-language view for beginners (**Regular Mode**) and a quantitative analysis view for experienced traders (**Nerd Mode**). It features intelligent IPO analysis, stock screening, portfolio tracking, mutual fund recommendations, and a private, local AI sentiment model.

## 🎯 Vision

Transform Indian investing with simplified, plain-language AI-driven insights. Dual-mode interface (Regular for beginners, Nerd for quants). Free, open-source, and fully localized.

## 📋 Phase 0: Foundation (COMPLETE)

### Deliverables
✅ Modern tech stack setup (React 18, Node.js ES Modules, Zustand, Socket.io)  
✅ Folder structure (frontend + backend modularized)  
✅ Authentication scaffolding (JWT, Passport.js)  
✅ 4 Zustand stores (auth, app, portfolio, data)  
✅ Core UI component library (Button, Card, Badge, Input)  
✅ i18n setup (English + Hindi)  
✅ PostgreSQL schema with 7 base tables  
✅ TailwindCSS styling system  

### What's Ready
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/profile` endpoints
- Zustand stores with localStorage persistence
- Layout components (Header, Footer) with mode toggle
- Home page with feature highlights
- Error handling and logging infrastructure
- CI/CD skeleton (ready for Phase 1)

---

## 📊 Tech Stack (Phase 0)

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | React 18 + Vite + TailwindCSS | Fast, minimal, modern |
| **State** | Zustand | Lightweight alternative to Redux |
| **UI Library** | TailwindCSS | Utility-first CSS |
| **I18n** | i18next | Multi-language support |
| **Backend** | Node.js (ES Modules) + Express | Modern, scalable |
| **API** | RESTful JSON + Socket.io | Real-time ready |
| **Auth** | JWT + Passport.js | Stateless, secure |
| **Database** | PostgreSQL | Robust, ACID-compliant |
| **Logging** | Winston | Structured logging |

---

## 📁 Project Structure

```
Buildathon/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # PostgreSQL connection pool
│   │   │   └── logger.js        # Winston logging setup
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT & Passport strategies
│   │   ├── routes/
│   │   │   └── auth.js          # Auth endpoints (register/login/profile)
│   │   ├── models/
│   │   │   └── schema.js        # Database schema initialization
│   │   ├── services/            # (placeholder for Phase 1)
│   │   ├── jobs/                # (placeholder for data jobs)
│   │   └── utils/               # (placeholder)
│   ├── logs/                    # Application logs
│   ├── .env                     # Local config (gitignored)
│   ├── .env.example             # Template
│   ├── package.json
│   └── server.js                # Express + Socket.io entry point
│
├── frontend/
│   ├── src/
│   │   ├── stores/              # Zustand stores
│   │   │   ├── authStore.js     # User auth state
│   │   │   ├── appStore.js      # Mode, language, theme
│   │   │   ├── portfolioStore.js# Holdings, gains/loss
│   │   │   └── dataStore.js     # Market data (IPOs, stocks, quotes)
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI (Button, Card, Badge, Input)
│   │   │   ├── layout/          # Header, Footer
│   │   │   └── modules/         # (placeholder for feature modules)
│   │   ├── hooks/               # (placeholder)
│   │   ├── pages/               # (placeholder for routes)
│   │   ├── i18n/                # i18next setup
│   │   │   ├── index.js         # Config
│   │   │   └── locales/
│   │   │       ├── en.json      # English translations
│   │   │       └── hi.json      # Hindi translations
│   │   ├── App.jsx              # Root component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # TailwindCSS + base styles
│   ├── .env                     # Local config
│   ├── .env.example             # Template
│   ├── package.json
│   ├── vite.config.js           # Vite config
│   ├── tailwind.config.js       # TailwindCSS config
│   ├── postcss.config.js        # PostCSS setup
│   └── index.html
│
├── README.md                    # This file
├── .gitignore
└── netlify.toml                 # Netlify deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 12+ (for local development) OR use connection string

### Installation

1. **Clone & install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

3. **Setup environment files**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

### Development

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Frontend Build & Preview
```bash
cd frontend
npm run build     # Create optimized production build
npm run preview   # Test production build locally
```

---

## 📡 API Endpoints (Phase 0)

### Authentication
```
POST   /api/auth/register        # { email, password, name }
POST   /api/auth/login           # { email, password }
GET    /api/auth/me              # [JWT required] Get profile
PUT    /api/auth/profile         # [JWT required] Update profile
```

### Health Check
```
GET    /health                   # { status: "ok", timestamp }
```

---

## 🗄️ Database Schema (Phase 0)

**Tables created on startup:**
- `users` - User accounts, KYC status, mode preference
- `ipos` - IPO master data
- `gmp_history` - GMP price tracking
- `portfolio_holdings` - User holdings
- `alerts` - Price & milestone alerts
- `market_quotes` - Real-time stock quotes
- `news` - News/sentiment data (placeholder for Phase 1)

See `backend/src/models/schema.js` for full DDL.

---

## 🎨 UI Components (Phase 0)

### Available Components
- **Button** - Variants: primary, secondary, danger | Sizes: sm, md, lg
- **Card** - Container with shadow & padding
- **Badge** - Variants: default, success, warning, danger
- **Input** - With label, error state, validation styles
- **Header** - Mode toggle, logo, navigation
- **Footer** - Disclaimer & links

### Styling
All components use TailwindCSS utility classes. Dark mode support ready.

---

## 🌍 Internationalization (i18n)

**Supported languages:** English, Hindi

**Usage in components:**
```jsx
import { useI18next } from 'react-i18next';

function MyComponent() {
  const { i18n } = useI18next();
  const currentLanguage = i18n.language; // "en" or "hi"
}
```

**Translation keys in `src/i18n/locales/en.json` and `hi.json`**

---

## 🔐 Authentication Flow (Phase 0)

1. User submits email + password
2. Backend hashes password with bcrypt, saves to DB
3. Backend returns JWT token
4. Zustand `authStore` persists token & user to localStorage
5. `api.js` interceptor adds JWT to all requests
6. Protected routes check `authenticateJWT` middleware

---

## 📦 Zustand Stores

### authStore
```js
useAuthStore.getState().setUser(user, token)
useAuthStore.getState().logout()
useAuthStore.getState().isAuthenticated  // boolean
useAuthStore.getState().token            // JWT string
```

### appStore
```js
useAppStore.getState().setMode('nerd' | 'regular')
useAppStore.getState().setLanguage('en' | 'hi')
useAppStore.getState().mode              // current mode
```

### portfolioStore
```js
usePortfolioStore.getState().addHolding(holding)
usePortfolioStore.getState().updateTotals({ totalValue, gainLoss, ... })
usePortfolioStore.getState().holdings    // array
```

### dataStore
```js
useDataStore.getState().setIpos(ipos)
useDataStore.getState().updateQuote(symbol, quote)
useDataStore.getState().quotes           // { NIFTY50: {...}, ... }
```

---

## 🧪 Testing (Phase 1)

Jest + React Testing Library test files will be added in Phase 1.

```bash
npm test              # Run tests
npm run test:ui       # Vitest UI
```

---

## 🚢 Deployment

### Netlify (Recommended)
```bash
cd frontend
npm run build
# Push to GitHub, connect to Netlify
# netlify.toml handles build command + functions
```

### Self-Hosted
- Frontend: Any static host (Vercel, GitHub Pages)
- Backend: Node.js host (Render, Railway, VPS) with PostgreSQL

---

## 🔄 Phase Roadmap

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| **0** | Weeks 1-2 | Foundation, scaffolding, auth | ✅ COMPLETE |
| **1A** | Week 3 | Onboarding (KYC, quiz, mode toggle) | 🔄 TODO |
| **1B** | Week 4 | Market data integration (NSE/BSE APIs) | 🔄 TODO |
| **1C** | Week 5 | IPO Analyzer module + verdicts | 🔄 TODO |
| **1D** | Week 6 | Stock Screener + insider trades | 🔄 TODO |
| **1E** | Week 7 | Portfolio Tracker + XIRR + Alerts | 🔄 TODO |
| **1F** | Week 7 | SPI/FPO/OFS Tracker | 🔄 TODO |
| **1G** | Week 8-9 | Mutual Funds module | 🔄 TODO |
| **1H** | Week 9-10 | AI/ML (sentiment, predictions, red flags) | 🔄 TODO |
| **1I** | Week 10-11 | Real-time WebSocket + UX polish | 🔄 TODO |
| **1J** | Week 11 | Broker integrations (Zerodha, Groww) | 🔄 TODO |
| **1K** | Week 12-13 | Testing, performance, accessibility | 🔄 TODO |
| **1L** | Week 13-14 | Documentation + deployment | 🔄 TODO |

---

## 🎓 Key Decisions (Phase 0)

✅ **ES Modules** - Used `type: "module"` for modern syntax  
✅ **Zustand** - Lightweight state management vs Redux  
✅ **Tailwind** - Utility-first CSS for rapid UI development  
✅ **Socket.io** - Real-time data ready for Phase 1  
✅ **i18n** - English + Hindi from day 1  
✅ **Separation of concerns** - Frontend & backend in separate directories  

---

## 📝 Notes for Phase 1

### Critical Todos
- [ ] Implement Phase 1A (Onboarding)
- [ ] Connect NSE/BSE free APIs for real market data
- [ ] Build IPO Analyzer verdict engine
- [ ] Integrate GMP scraper (Playwright)
- [ ] Add Hugging Face models for sentiment analysis
- [ ] Build portfolio XIRR calculator
- [ ] Implement WebSocket for real-time quotes
- [ ] Add 70%+ test coverage
- [ ] Deploy to Netlify + PostgreSQL

### Dependencies for Phase 1B+
- NSE/BSE API endpoints (free public data)
- SEBI EDIFAR XML parser
- Playwright for GMP scraping
- Hugging Face Transformers.js for NLP
- TensorFlow.js for predictions

---

## 🛠️ Development Tips

1. **Adding a new store**: Create file in `frontend/src/stores/`, export with `create()`
2. **Adding a new API route**: Create file in `backend/src/routes/`, export router, import in `server.js`
3. **UI components**: Extend `frontend/src/components/ui/index.jsx`
4. **Translations**: Add keys to `en.json` and `hi.json` in `src/i18n/locales/`
5. **Database schema**: Update `backend/src/models/schema.js` and restart backend

---

## 📄 License

Open source - no restrictions. Commercial use allowed.

---

## 🤝 Contributors

Built by Copilot + Solo Developer

---

## 📞 Support & Feedback

BHARATNIVESH is in active development. Phase 1 starts immediately after Phase 0 handoff.

**Current Status**: Ready for Phase 1 (Market Data Integration & IPO Analyzer)
