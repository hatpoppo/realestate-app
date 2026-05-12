-- =============================================
-- 不動産管理アプリ: properties テーブル
-- Supabase の SQL Editor で実行してください
-- =============================================

-- 物件テーブル作成
CREATE TABLE properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT        NOT NULL,                -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent > 0), -- 家賃（円）
  area        TEXT        NOT NULL,                -- エリア名
  floor_plan  TEXT        NOT NULL,                -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS（行レベルセキュリティ）を有効化
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT: 自分が登録した物件のみ参照可能
CREATE POLICY "自分の物件を参照できる"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: user_id が自分の UUID と一致する場合のみ登録可能
CREATE POLICY "自分の物件を登録できる"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: 自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件を更新できる"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: 自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件を削除できる"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
