CREATE TABLE IF NOT EXISTS good_scroll_posts (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 type TEXT NOT NULL,
 text TEXT NOT NULL,
 reference TEXT NOT NULL DEFAULT '',
 caption TEXT NOT NULL DEFAULT '',
 background TEXT NOT NULL DEFAULT '#e6ece3',
 color TEXT NOT NULL DEFAULT '#405b49',
 align TEXT NOT NULL DEFAULT 'center',
 image_key TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_good_scroll_status_updated ON good_scroll_posts(status,updated_at DESC);
