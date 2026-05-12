# CLAUDE.md

このファイルは、リポジトリ内のコードを操作する際に Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

```bash
npm install        # 依存関係のインストール
npm run dev        # 開発サーバー起動（http://localhost:5173）
npm run build      # プロダクションビルド（dist/ に出力）
npm run preview    # ビルド成果物のプレビュー
```

## 環境変数

`.env` ファイルをルートに作成し、以下を設定する（`.gitignore` 済み）:

```
VITE_SUPABASE_URL=<Supabase Project URL>
VITE_SUPABASE_PUBLISHABLE_KEY=<Supabase Publishable Key>
```

## アーキテクチャ

**技術スタック**: React 18 + Vite 6 + React Router v7 + Supabase JS v2

### 認証フロー

- `src/lib/supabase.js` — Supabase クライアントのシングルトン。全ページがここを経由して認証操作を行う。
- `src/components/PrivateRoute.jsx` — `supabase.auth.getSession()` でセッションを確認し、未ログインなら `/login` へリダイレクト。`onAuthStateChange` でセッション変化も監視する。
- ルート `/` は `/login` へリダイレクト。`/properties` は `PrivateRoute` でラップされている。

### ページ構成

| パス          | ファイル                   | 説明                                 |
| ------------- | -------------------------- | ------------------------------------ |
| `/login`      | `src/pages/Login.jsx`      | メール＋パスワードでログイン         |
| `/register`   | `src/pages/Register.jsx`   | 会員登録（メール確認あり）           |
| `/properties` | `src/pages/Properties.jsx` | 物件一覧（ダミーデータ）＋ログアウト |

### スタイル

グローバル CSS のみ（`src/index.css`）。コンポーネントライブラリ・CSS Modules は未使用。

## デプロイ情報

- 本番URL：https://realestate-app-liard.vercel.app
- Supabaseプロジェクト名：realestate-app
