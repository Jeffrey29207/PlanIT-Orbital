-- 1) ENUM types for strong typing
CREATE TYPE txn_type AS ENUM ('spend','save','transfer');
CREATE TYPE txn_subtype AS ENUM (
  'modify_spending',
  'modify_savings',
  'saving_to_spending',
  'spending_to_saving'
);
CREATE TYPE freq_type AS ENUM ('one-time','daily','weekly','monthly','yearly');

-- 2) Users: immutable identity & credentials
CREATE TABLE users (
  user_id        SERIAL        PRIMARY KEY,
  username       VARCHAR(50)   UNIQUE NOT NULL,
  password_hash  VARCHAR(255)  NOT NULL,
  email          VARCHAR(255)  UNIQUE,
  created_at     TIMESTAMP     NOT NULL DEFAULT now(),
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE
);

-- 3) Accounts: mutable current balances
CREATE TABLE accounts (
  account_id       SERIAL        PRIMARY KEY,
  user_id          INT           NOT NULL REFERENCES users(user_id),
  account_name     VARCHAR(50)   NOT NULL DEFAULT 'default',
  total_balance    NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  spending_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00, -- need to differentiate spending committment and actual spending
  saving_balance   NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  updated_at       TIMESTAMP     NOT NULL DEFAULT now(),
  UNIQUE(user_id, account_name)
);

-- 4) Transactions: immutable audit log
CREATE TABLE transactions (
  tx_id        BIGSERIAL      PRIMARY KEY,
  account_id   INT            NOT NULL REFERENCES accounts(account_id),
  tx_type      txn_type       NOT NULL,
  subtype      txn_subtype    NOT NULL,
  amount       NUMERIC(12,2)  NOT NULL,
  category     VARCHAR(50),
  description  TEXT,
  frequency    freq_type      NOT NULL DEFAULT 'one-time',
  created_at   TIMESTAMP      NOT NULL DEFAULT now()
);

-- 5) Recurring instructions: drives automated inserts
CREATE TABLE recurring_transactions (
  recur_id     SERIAL         PRIMARY KEY,
  account_id   INT            NOT NULL REFERENCES accounts(account_id),
  tx_type      txn_type       NOT NULL,
  subtype      txn_subtype    NOT NULL,
  amount       NUMERIC(12,2)  NOT NULL,
  category     VARCHAR(50),
  frequency    freq_type      NOT NULL DEFAULT 'monthly',
  interval     INT            NOT NULL DEFAULT 1,      -- e.g. every N units
  next_run_at  TIMESTAMP      NOT NULL,
  end_date     DATE,                             -- NULL = never end
  is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP      NOT NULL DEFAULT now(),
  CHECK (interval > 0),
  CHECK (end_date IS NULL OR next_run_at::date <= end_date)
);