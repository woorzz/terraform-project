CREATE TABLE IF NOT EXISTS example (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL
);

INSERT INTO example (message) VALUES ('Hello from Postgres')
ON CONFLICT DO NOTHING;
