CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL CHECK (length(trim(name)) > 0),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX sessions_user_id_idx ON sessions(user_id);
CREATE TABLE clients (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(160) NOT NULL CHECK (length(trim(name)) > 0),
  code VARCHAR(40) NOT NULL UNIQUE CHECK (length(trim(code)) > 0)
);
CREATE TABLE deals (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL,
  number VARCHAR(60) NOT NULL UNIQUE CHECK (length(trim(number)) > 0),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  description TEXT NOT NULL DEFAULT ''
);
CREATE INDEX deals_date_idx ON deals(date);
CREATE INDEX deals_client_id_idx ON deals(client_id);
