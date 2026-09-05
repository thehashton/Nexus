CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT (auth.user_id()::uuid) REFERENCES neon_auth."user"(id),
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  due_date date,
  tags text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT (auth.user_id()::uuid) REFERENCES neon_auth."user"(id),
  title text NOT NULL,
  date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  notes text
);

CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT (auth.user_id()::uuid) REFERENCES neon_auth."user"(id),
  company text NOT NULL,
  role text NOT NULL,
  stage text NOT NULL CHECK (stage IN ('applied','interview','offer','rejected')),
  notes text,
  applied_date date NOT NULL,
  last_updated timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY todos_own_rows ON todos FOR ALL TO authenticated
  USING (auth.user_id() = user_id::text)
  WITH CHECK (auth.user_id() = user_id::text);

CREATE POLICY goals_own_rows ON goals FOR ALL TO authenticated
  USING (auth.user_id() = user_id::text)
  WITH CHECK (auth.user_id() = user_id::text);

CREATE POLICY job_applications_own_rows ON job_applications FOR ALL TO authenticated
  USING (auth.user_id() = user_id::text)
  WITH CHECK (auth.user_id() = user_id::text);

GRANT SELECT, INSERT, UPDATE, DELETE ON todos, goals, job_applications TO authenticated;
