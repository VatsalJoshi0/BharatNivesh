import { useState } from "react";

const palette = {
  bg: "#050A14",
  surface: "#0D1626",
  card: "#111D2E",
  border: "#1A2D45",
  accent: "#00C6FF",
  accentGold: "#FFB830",
  accentGreen: "#00E676",
  accentRed: "#FF5252",
  accentPurple: "#7C4DFF",
  text: "#E8F1FF",
  muted: "#5A7A9A",
  nerd: "#7C4DFF",
  regular: "#00C6FF",
};

const layers = [
  {
    id: "user",
    label: "USER LAYER",
    color: palette.accentGold,
    nodes: [
      { id: "retail", label: "Retail Investor", icon: "👤", desc: "First-time / casual" },
      { id: "hni", label: "HNI / UHNI", icon: "💼", desc: "High Net-Worth" },
      { id: "trader", label: "Active Trader", icon: "📊", desc: "Day / Swing trader" },
      { id: "institution", label: "Institution", icon: "🏦", desc: "MFs, Family Offices" },
    ],
  },
  {
    id: "auth",
    label: "AUTH & ONBOARDING",
    color: palette.accent,
    nodes: [
      { id: "kyc", label: "KYC / SEBI Verification", icon: "🪪", desc: "DigiLocker + PAN" },
      { id: "profile", label: "Investor Profiling", icon: "🎯", desc: "Risk appetite quiz" },
      { id: "broker", label: "Broker Linking", icon: "🔗", desc: "Zerodha / Groww / ICICI" },
      { id: "demat", label: "Demat Sync", icon: "📂", desc: "CDSL / NSDL via CDSL API" },
    ],
  },
  {
    id: "mode",
    label: "DUAL MODE ENGINE",
    color: palette.accentGold,
    nodes: [
      {
        id: "regular",
        label: "Regular Mode",
        icon: "🌅",
        desc: "Plain-language insights, simple graphs, apply/skip verdicts",
        color: palette.regular,
      },
      {
        id: "nerd",
        label: "Nerd Mode",
        icon: "🧠",
        desc: "Full quant analysis, DCF, ratios, screeners, raw data",
        color: palette.nerd,
      },
    ],
  },
  {
    id: "modules",
    label: "CORE MODULES",
    color: palette.accentGreen,
    nodes: [
      { id: "ipo", label: "IPO Analyser", icon: "🚀", desc: "Mainboard + SME" },
      { id: "stock", label: "Stock Screener", icon: "📈", desc: "NSE / BSE universe" },
      { id: "spi", label: "SPI / FPO / OFS", icon: "🔄", desc: "Secondary offerings" },
      { id: "mf", label: "Mutual Funds", icon: "🪙", desc: "Direct / Regular plans" },
      { id: "portfolio", label: "Portfolio Tracker", icon: "🗂️", desc: "P&L + XIRR" },
      { id: "alerts", label: "Smart Alerts", icon: "🔔", desc: "GMP, listing, triggers" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML BRAIN",
    color: palette.accentPurple,
    nodes: [
      { id: "nlp", label: "NLP Engine", icon: "💬", desc: "DRHP / Annual report parsing" },
      { id: "sentiment", label: "Sentiment AI", icon: "🌡️", desc: "News + social signals" },
      { id: "predict", label: "Prediction Models", icon: "🔮", desc: "Listing gain estimator" },
      { id: "advisor", label: "AI Advisor", icon: "🤖", desc: "Personalised verdicts" },
      { id: "fraud", label: "Red Flag Detector", icon: "🚩", desc: "Forensic accounting AI" },
    ],
  },
  {
    id: "data",
    label: "DATA LAYER",
    color: palette.accentRed,
    nodes: [
      { id: "bse", label: "BSE / NSE Feed", icon: "📡", desc: "Real-time + historical" },
      { id: "sebi", label: "SEBI / RHP Data", icon: "📋", desc: "DRHP, financials" },
      { id: "gmp", label: "GMP Aggregator", icon: "💹", desc: "Multi-source GMP" },
      { id: "news", label: "News & Social", icon: "📰", desc: "RSS + Twitter / Reddit" },
      { id: "macro", label: "Macro Indicators", icon: "🌐", desc: "RBI, MoSPI, IMF data" },
    ],
  },
  {
    id: "infra",
    label: "INFRASTRUCTURE",
    color: palette.muted,
    nodes: [
      { id: "api", label: "API Gateway", icon: "⚙️", desc: "Rate-limited REST / WS" },
      { id: "cache", label: "Redis Cache", icon: "⚡", desc: "Sub-100ms responses" },
      { id: "db", label: "TimescaleDB", icon: "🗄️", desc: "Time-series stock data" },
      { id: "queue", label: "Kafka Queue", icon: "🔀", desc: "Event streaming" },
      { id: "cdn", label: "CDN / Edge", icon: "🌍", desc: "Cloudflare India PoPs" },
    ],
  },
];

const flowSteps = [
  { step: "01", title: "User Lands & Registers", detail: "Mobile / Web → OTP Auth → PAN verification via DigiLocker → SEBI-compliant KYC", color: palette.accentGold },
  { step: "02", title: "Investor Profiling Quiz", detail: "7-question risk quiz → Classifies as Conservative / Moderate / Aggressive → Unlocks personalised feed", color: palette.accent },
  { step: "03", title: "Broker & Demat Linking", detail: "OAuth with Zerodha / Groww / Upstox / Angel → CDSL/NSDL demat sync → Auto portfolio import", color: palette.accentGreen },
  { step: "04", title: "Mode Selection", detail: "Toggle: Regular 🌅 or Nerd 🧠 — remembers preference — can switch mid-session anytime", color: palette.accentGold },
  { step: "05", title: "Asset Discovery", detail: "Browse IPOs / Stocks / MFs → AI-ranked by relevance to user's risk profile and past behaviour", color: palette.accentPurple },
  { step: "06", title: "Deep Analysis Engine Fires", detail: "Regular: Plain summary + traffic light verdict. Nerd: Full DCF, ratio trees, GMP curve, subscription heatmap", color: palette.accentRed },
  { step: "07", title: "Action Gateway", detail: "Apply for IPO → routed to linked broker API. Buy/Sell stock → broker deeplink. One-click UPI for IPO ASBA", color: palette.accent },
  { step: "08", title: "Post-Event Tracking", detail: "Allotment result → Listing day P&L → Portfolio XIRR → Smart exit signals", color: palette.accentGreen },
];

const regularVsNerd = [
  { feature: "IPO Analysis", regular: "Apply / Skip / Wait badge + 3-line reason", nerd: "GMP curve, subscription heatmap, DCF valuation, promoter pledge %, peer P/E" },
  { feature: "Stock View", regular: "52-week trend, sector rank, analyst target", nerd: "DuPont breakdown, Altman Z-score, insider trade flow, options OI chart" },
  { feature: "Language", regular: "Hindi + English, zero jargon", nerd: "Full financial terminology, exportable CSV / PDF" },
  { feature: "Graphs", regular: "Simple candlestick, sector donut", nerd: "Multi-timeframe, volume profile, Monte Carlo simulation" },
  { feature: "Alerts", regular: "Price crossed ₹X, allotment tomorrow", nerd: "IV spike, block deal, bulk deal, promoter holding change" },
  { feature: "News", regular: "Top 3 headlines, sentiment badge", nerd: "Full news timeline, sentiment score history, source credibility rating" },
];

export default function App() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <div style={{
      background: palette.bg,
      minHeight: "100vh",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: palette.text,
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #050A14 0%, #0D1626 50%, #050A14 100%)`,
        borderBottom: `1px solid ${palette.border}`,
        padding: "28px 40px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(0,198,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,184,48,0.05) 0%, transparent 60%)`,
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: `linear-gradient(135deg, ${palette.accent}, ${palette.accentGold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
            }}>📈</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: palette.text }}>
                BHARATNIVESH
              </div>
              <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3 }}>
                INTELLIGENT INVESTMENT PLATFORM — SYSTEM ARCHITECTURE v1.0
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {["architecture", "userflow", "modes", "tech"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: `1px solid ${activeTab === tab ? palette.accent : palette.border}`,
                  background: activeTab === tab ? `${palette.accent}18` : "transparent",
                  color: activeTab === tab ? palette.accent : palette.muted,
                  fontSize: 11,
                  letterSpacing: 2,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 40px" }}>

        {/* ARCHITECTURE TAB */}
        {activeTab === "architecture" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 6 }}>SYSTEM LAYERS — CLICK TO EXPAND</div>
              <div style={{ fontSize: 13, color: palette.muted, maxWidth: 700 }}>
                7-layer architecture from user-facing interfaces down to data infrastructure. Each layer is independently scalable.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {layers.map((layer, li) => (
                <div key={layer.id}>
                  {/* Layer header */}
                  <div
                    onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 18px",
                      background: palette.surface,
                      border: `1px solid ${activeLayer === layer.id ? layer.color + "60" : palette.border}`,
                      borderRadius: activeLayer === layer.id ? "8px 8px 0 0" : 8,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 4, height: 36, borderRadius: 2,
                      background: layer.color,
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, letterSpacing: 3, color: layer.color, marginBottom: 2 }}>
                        LAYER {String(li + 1).padStart(2, "0")}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: palette.text }}>{layer.label}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {layer.nodes.map(n => (
                        <div key={n.id} style={{
                          fontSize: 16,
                          opacity: 0.7,
                          background: palette.card,
                          width: 32, height: 32,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 6,
                        }}>{n.icon}</div>
                      ))}
                    </div>
                    <div style={{ color: palette.muted, fontSize: 14 }}>
                      {activeLayer === layer.id ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded nodes */}
                  {activeLayer === layer.id && (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${Math.min(layer.nodes.length, 4)}, 1fr)`,
                      gap: 1,
                      background: palette.border,
                      border: `1px solid ${layer.color}60`,
                      borderTop: "none",
                      borderRadius: "0 0 8px 8px",
                      overflow: "hidden",
                    }}>
                      {layer.nodes.map(node => (
                        <div key={node.id} style={{
                          background: palette.card,
                          padding: "16px 14px",
                          display: "flex", flexDirection: "column", gap: 6,
                        }}>
                          <div style={{ fontSize: 22 }}>{node.icon}</div>
                          <div style={{
                            fontSize: 12, fontWeight: 600, color: node.color || layer.color,
                            lineHeight: 1.3,
                          }}>{node.label}</div>
                          <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.5 }}>{node.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Connector arrow */}
                  {li < layers.length - 1 && (
                    <div style={{
                      display: "flex", justifyContent: "center",
                      padding: "4px 0",
                      color: palette.border,
                      fontSize: 16,
                    }}>▼</div>
                  )}
                </div>
              ))}
            </div>

            {/* Data flow legend */}
            <div style={{
              marginTop: 28,
              padding: "16px 20px",
              background: palette.surface,
              border: `1px solid ${palette.border}`,
              borderRadius: 8,
              display: "flex", gap: 24, flexWrap: "wrap",
            }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: palette.muted, alignSelf: "center" }}>DATA FLOW</div>
              {[
                { label: "Real-time WebSocket", color: palette.accentGreen },
                { label: "REST API (cached)", color: palette.accent },
                { label: "Kafka event stream", color: palette.accentPurple },
                { label: "Broker OAuth 2.0", color: palette.accentGold },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 24, height: 2, background: f.color }} />
                  <div style={{ fontSize: 11, color: palette.muted }}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USER FLOW TAB */}
        {activeTab === "userflow" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 6 }}>END-TO-END USER JOURNEY</div>
              <div style={{ fontSize: 13, color: palette.muted }}>From first login to portfolio exit — complete 8-step workflow.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {flowSteps.map((s, i) => (
                <div key={s.step} style={{
                  display: "grid", gridTemplateColumns: "72px 1fr",
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}>
                  <div style={{
                    background: `${s.color}18`,
                    borderRight: `1px solid ${palette.border}`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "16px 8px",
                  }}>
                    <div style={{ fontSize: 20, color: s.color, fontWeight: 700 }}>{s.step}</div>
                    {i < flowSteps.length - 1 && (
                      <div style={{ color: palette.border, marginTop: 8, fontSize: 16 }}>↓</div>
                    )}
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.7 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODES TAB */}
        {activeTab === "modes" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 6 }}>DUAL MODE COMPARISON</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{
                  flex: 1, padding: "16px 20px",
                  background: `${palette.regular}12`,
                  border: `1px solid ${palette.regular}40`,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 16, marginBottom: 6 }}>🌅</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: palette.regular, marginBottom: 4 }}>Regular Mode</div>
                  <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.7 }}>
                    Designed for first-time investors, vernacular users, and anyone who doesn't want to dig deep. 
                    Traffic-light verdicts (Green = Apply, Yellow = Wait, Red = Avoid). 
                    Hindi + English. Zero jargon. Simple charts. One-tap actions.
                  </div>
                </div>
                <div style={{
                  flex: 1, padding: "16px 20px",
                  background: `${palette.nerd}12`,
                  border: `1px solid ${palette.nerd}40`,
                  borderRadius: 8,
                }}>
                  <div style={{ fontSize: 16, marginBottom: 6 }}>🧠</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: palette.nerd, marginBottom: 4 }}>Nerd Mode</div>
                  <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.7 }}>
                    Built for analysts, traders, and HNIs who want every data point. 
                    DCF models, forensic accounting flags, option chain overlays, 
                    promoter pledge history, grey market premium curves, SEBI inspection logs.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 12 }}>FEATURE MATRIX</div>
            <div style={{
              border: `1px solid ${palette.border}`,
              borderRadius: 8, overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr",
                background: palette.surface,
                borderBottom: `1px solid ${palette.border}`,
              }}>
                <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: 2, color: palette.muted }}>FEATURE</div>
                <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: 2, color: palette.regular, borderLeft: `1px solid ${palette.border}` }}>🌅 REGULAR</div>
                <div style={{ padding: "10px 16px", fontSize: 10, letterSpacing: 2, color: palette.nerd, borderLeft: `1px solid ${palette.border}` }}>🧠 NERD</div>
              </div>
              {regularVsNerd.map((row, i) => (
                <div key={row.feature} style={{
                  display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr",
                  background: i % 2 === 0 ? palette.card : palette.surface,
                  borderBottom: i < regularVsNerd.length - 1 ? `1px solid ${palette.border}` : "none",
                }}>
                  <div style={{ padding: "12px 16px", fontSize: 11, color: palette.text, fontWeight: 600 }}>{row.feature}</div>
                  <div style={{ padding: "12px 16px", fontSize: 11, color: palette.muted, lineHeight: 1.5, borderLeft: `1px solid ${palette.border}` }}>{row.regular}</div>
                  <div style={{ padding: "12px 16px", fontSize: 11, color: palette.muted, lineHeight: 1.5, borderLeft: `1px solid ${palette.border}` }}>{row.nerd}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TECH STACK TAB */}
        {activeTab === "tech" && (
          <div>
            <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 20 }}>RECOMMENDED TECH STACK</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                {
                  category: "Frontend", color: palette.accent, items: [
                    ["React Native + Next.js", "Mobile (iOS/Android) + Web PWA"],
                    ["TradingView Charting Lib", "Professional stock charts"],
                    ["Zustand + React Query", "State + async data management"],
                    ["i18n (Hindi/English/Regional)", "Multi-language support"],
                  ]
                },
                {
                  category: "Backend", color: palette.accentGreen, items: [
                    ["FastAPI (Python)", "AI/ML microservices"],
                    ["Node.js + Express", "Real-time WebSocket gateway"],
                    ["GraphQL (Hasura)", "Flexible data querying"],
                    ["gRPC", "Inter-service communication"],
                  ]
                },
                {
                  category: "AI / ML", color: palette.accentPurple, items: [
                    ["FinBERT (fine-tuned)", "Financial sentiment NLP"],
                    ["XGBoost / LightGBM", "Listing gain prediction"],
                    ["LangChain + Gemini Flash", "DRHP document parser"],
                    ["Scikit-learn", "Risk scoring models"],
                  ]
                },
                {
                  category: "Data & Infra", color: palette.accentGold, items: [
                    ["TimescaleDB + PostgreSQL", "Time-series + relational"],
                    ["Redis Cluster", "Real-time GMP + quote cache"],
                    ["Apache Kafka", "Event streaming pipeline"],
                    ["AWS Mumbai (ap-south-1)", "SEBI data residency compliant"],
                  ]
                },
                {
                  category: "Market Data", color: palette.accentRed, items: [
                    ["NSE / BSE WebSocket feed", "Live quotes, order book"],
                    ["Ticker Plant / Refinitiv", "Premium historical data"],
                    ["SEBI EDIFAR scraper", "DRHP + disclosures"],
                    ["Custom GMP aggregator", "Multi-source grey market"],
                  ]
                },
                {
                  category: "Compliance", color: palette.muted, items: [
                    ["SEBI Registered IA", "SEBI Investment Adviser Reg"],
                    ["KYC via DigiLocker API", "MeitY-approved eKYC"],
                    ["UIDAI Aadhaar OTP", "Identity verification"],
                    ["CDSL CAS API", "Demat portfolio sync"],
                  ]
                },
              ].map(section => (
                <div key={section.category} style={{
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    padding: "10px 16px",
                    borderBottom: `1px solid ${palette.border}`,
                    background: `${section.color}12`,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: section.color }} />
                    <div style={{ fontSize: 11, letterSpacing: 2, color: section.color }}>{section.category.toUpperCase()}</div>
                  </div>
                  <div>
                    {section.items.map(([name, desc]) => (
                      <div key={name} style={{
                        padding: "10px 16px",
                        borderBottom: `1px solid ${palette.border}`,
                        display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start",
                      }}>
                        <div style={{ fontSize: 11, color: palette.text, fontWeight: 600, flexShrink: 0 }}>{name}</div>
                        <div style={{ fontSize: 10, color: palette.muted, textAlign: "right", lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Monetisation section */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: palette.muted, letterSpacing: 3, marginBottom: 12 }}>MONETISATION MODEL</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { tier: "Free", color: palette.muted, price: "₹0", features: "Regular Mode · 5 IPO analyses/month · Basic portfolio" },
                  { tier: "Pro", color: palette.accent, price: "₹299/mo", features: "Nerd Mode · Unlimited analyses · Smart alerts · Tax P&L" },
                  { tier: "HNI", color: palette.accentGold, price: "₹999/mo", features: "Everything + AI advisor · Priority allotment tips · White-glove reports" },
                  { tier: "Institution", color: palette.accentPurple, price: "Custom", features: "API access · Bulk data · Custom screeners · Dedicated RM" },
                ].map(t => (
                  <div key={t.tier} style={{
                    flex: 1, minWidth: 160,
                    background: palette.surface,
                    border: `1px solid ${t.color}40`,
                    borderRadius: 8, padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: 10, letterSpacing: 2, color: t.color, marginBottom: 4 }}>{t.tier.toUpperCase()}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: palette.text, marginBottom: 8 }}>{t.price}</div>
                    <div style={{ fontSize: 10, color: palette.muted, lineHeight: 1.7 }}>{t.features}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 32, padding: "16px 0",
          borderTop: `1px solid ${palette.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ fontSize: 10, color: palette.muted, letterSpacing: 2 }}>BHARATNIVESH PLATFORM · SYSTEM DESIGN v1.0 · CONFIDENTIAL</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "SEBI Compliant", color: palette.accentGreen },
              { label: "RBI Reg'd", color: palette.accent },
              { label: "ISO 27001", color: palette.accentGold },
            ].map(b => (
              <div key={b.label} style={{
                fontSize: 9, letterSpacing: 1,
                color: b.color,
                border: `1px solid ${b.color}40`,
                padding: "3px 8px", borderRadius: 4,
              }}>{b.label}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
