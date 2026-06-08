# BHARATNIVESH - AI-Powered Indian Investment Platform

> [!IMPORTANT]
> **Prototype & Thought Process Disclaimer:**
> BHARATNIVESH is currently a **functional prototype and conceptual thought process**. Some features use simulated feeds or mock local models to demonstrate user experiences. Certain advanced broker integrations and real-time CDSL demat syncs are structural layouts showcasing the planned product journey.

BHARATNIVESH is a comprehensive AI-powered investment platform for Indian retail investors, HNIs, active traders, and institutions. The platform provides a unique Dual-Mode Interface: a simplified, plain-language view for beginners (**Regular Mode**) and a quantitative analysis view for experienced traders (**Nerd Mode**). It features intelligent IPO analysis, stock screening, portfolio tracking, mutual fund recommendations, and a private, local AI sentiment model.

## 🎯 Vision

Transform Indian investing with simplified, plain-language AI-driven insights. Dual-mode interface (Regular for beginners, Nerd for quants). Free, open-source, and fully localized.

---

## 📊 Tech Stack

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
│   │   ├── services/            # Backend business logic & scrapers
│   │   ├── jobs/                # Background data update jobs
│   │   └── utils/               # Common utilities
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
│   │   │   └── modules/         # Feature-specific layouts
│   │   ├── hooks/               # Custom React hooks (e.g., useSocket)
│   │   ├── pages/               # Screen components
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
├── docs/                        # Architecture guides & documentation
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

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register        # { email, password, name }
POST   /api/auth/login           # { email, password }
GET    /api/auth/me              # [JWT required] Get profile
PUT    /api/auth/profile         # [JWT required] Update profile
```

### Market & IPO Data
```
GET    /api/market/indices       # Live market overview indexes
GET    /api/market/analysis      # Mood, sector breadth, and analyst notes
GET    /api/ipos/upcoming        # Upcoming public offerings list
GET    /api/portfolio            # [JWT required] Get user holdings
```

### Health Check
```
GET    /health                   # { status: "ok", timestamp }
```

---

## 🗄️ Database Schema

**Tables created on startup:**
- `users` - User accounts, KYC status, mode preference
- `ipos` - IPO master data
- `gmp_history` - GMP price tracking
- `portfolio_holdings` - User holdings
- `alerts` - Price & milestone alerts
- `market_quotes` - Real-time stock quotes
- `news` - News/sentiment data

See `backend/src/models/schema.js` for full DDL.

---

## 🎨 UI Components

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

---

## 🔐 Authentication Flow

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

## 🧪 Testing

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

## 🎓 Key Decisions

✅ **ES Modules** - Used `type: "module"` for modern syntax  
✅ **Zustand** - Lightweight state management vs Redux  
✅ **Tailwind** - Utility-first CSS for rapid UI development  
✅ **Socket.io** - Real-time data ready  
✅ **i18n** - English + Hindi support  
✅ **Separation of concerns** - Frontend & backend in separate directories  

---

## 📄 License

Open source - no restrictions. Commercial use allowed.

---

## 🤝 Contributors

Built by Solo Developer

---

## 📞 Support & Feedback

BHARATNIVESH is in active development.
