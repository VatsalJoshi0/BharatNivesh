export async function initializeDatabaseSchema(pool) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        risk_profile VARCHAR(50),
        mode VARCHAR(20) DEFAULT 'regular',
        kyc_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ipos (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(50) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        price_band_low DECIMAL(10, 2),
        price_band_high DECIMAL(10, 2),
        issue_size BIGINT,
        open_date DATE,
        close_date DATE,
        allotment_date DATE,
        listing_date DATE,
        subscription_count DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS gmp_history (
        id SERIAL PRIMARY KEY,
        ipo_id INTEGER REFERENCES ipos(id),
        gmp_price DECIMAL(10, 2),
        recorded_date TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS portfolio_holdings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        symbol VARCHAR(50),
        quantity INTEGER,
        buy_price DECIMAL(10, 2),
        buy_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        alert_type VARCHAR(50),
        target_value DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS market_quotes (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(50) UNIQUE NOT NULL,
        price DECIMAL(10, 2),
        change DECIMAL(10, 2),
        change_percent DECIMAL(10, 2),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        sector VARCHAR(100),
        market_cap DECIMAL(15, 2),
        pe_ratio DECIMAL(10, 2),
        roe DECIMAL(10, 2),
        momentum_score INTEGER,
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS secondary_offerings (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(50) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price_band_low DECIMAL(10, 2),
        price_band_high DECIMAL(10, 2),
        open_date DATE,
        close_date DATE,
        subscription_count DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS mutual_funds (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100),
        risk_level VARCHAR(50),
        nav DECIMAL(10, 4),
        expense_ratio DECIMAL(5, 2),
        returns_3y DECIMAL(5, 2),
        returns_5y DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio_holdings(user_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
      CREATE INDEX IF NOT EXISTS idx_gmp_ipo ON gmp_history(ipo_id);
      CREATE INDEX IF NOT EXISTS idx_sec_offering_symbol ON secondary_offerings(symbol);
      CREATE INDEX IF NOT EXISTS idx_mf_category ON mutual_funds(category);
    `);
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Database schema initialization error:', err);
  }
}
