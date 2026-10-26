-- Run once against the production WHDC D1 database before deploying account endpoints.
CREATE TABLE IF NOT EXISTS reader_accounts (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS reader_sessions (token_hash TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES reader_accounts(id) ON DELETE CASCADE, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_reader_sessions_account ON reader_sessions(account_id);
CREATE TABLE IF NOT EXISTS reader_email_challenges (id TEXT PRIMARY KEY, email TEXT NOT NULL, email_hash TEXT NOT NULL, ip_hash TEXT NOT NULL, salt TEXT NOT NULL, code_hash TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_reader_email_challenges_email ON reader_email_challenges(email,created_at);
CREATE INDEX IF NOT EXISTS idx_reader_email_challenges_limits ON reader_email_challenges(created_at,email_hash,ip_hash);
