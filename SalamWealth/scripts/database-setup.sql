-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mykad_id VARCHAR(14) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  bumiputera_status BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MyKad verification cache
CREATE TABLE IF NOT EXISTS mykad_verification_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mykad_id VARCHAR(14) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  bumiputera_status BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financing applications
CREATE TABLE IF NOT EXISTS financing_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  financing_type VARCHAR(50) NOT NULL, -- personal, sme, education
  amount DECIMAL(12,2) NOT NULL,
  term_months INTEGER NOT NULL,
  profit_rate DECIMAL(5,2) NOT NULL,
  purpose TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, disbursed
  monthly_payment DECIMAL(12,2),
  takaful_included BOOLEAN DEFAULT TRUE,
  shariah_contract_type VARCHAR(50) NOT NULL, -- qardh_hasan, bai_al_inah, ijarah
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment accounts
CREATE TABLE IF NOT EXISTS investment_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  investment_type VARCHAR(50) NOT NULL, -- asb, sukuk, robo_advisory, gold
  amount DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) NOT NULL,
  profit_rate DECIMAL(5,2),
  halal_certified BOOLEAN DEFAULT TRUE,
  risk_rating INTEGER CHECK (risk_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- deposit, withdrawal, payment, investment, zakat
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Zakat calculations
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  cash DECIMAL(12,2) NOT NULL,
  savings DECIMAL(12,2) NOT NULL,
  investments DECIMAL(12,2) NOT NULL,
  gold DECIMAL(12,2) NOT NULL,
  debts DECIMAL(12,2) NOT NULL,
  total_wealth DECIMAL(12,2) NOT NULL,
  zakat_amount DECIMAL(12,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid
  calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EPF integration data
CREATE TABLE IF NOT EXISTS epf_integration (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  epf_number VARCHAR(50) UNIQUE NOT NULL,
  account_1_balance DECIMAL(12,2),
  account_2_balance DECIMAL(12,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE
);

-- Prayer times and mosque data
CREATE TABLE IF NOT EXISTS mosque_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  prayer_times JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- system, financing, investment, zakat, prayer
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authentication table for NextAuth
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  provider_type VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider_id, provider_account_id)
);

-- Sessions table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL
);

-- Verification tokens for email verification
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financing_user_id ON financing_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_user_id ON investment_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_zakat_user_id ON zakat_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
