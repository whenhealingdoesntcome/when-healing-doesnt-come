-- Apply once using Wrangler's migration ledger, AFTER GOOD-SCROLL-MIGRATION.sql.
-- SQLite ALTER TABLE ADD COLUMN is not repeatable; do not rerun this file directly.
ALTER TABLE good_scroll_posts ADD COLUMN design TEXT NOT NULL DEFAULT '{}';
