# AIstoic - サンダー対メタグロス特化計算機

## プロジェクト概要
ポケモン第三世代（ルビー・サファイア・エメラルド・FRLG）の対戦環境において、サンダー対メタグロスの1対1対戦におけるサンダー側の勝率を算出するツールです。

## 技術スタック
- Vite + React + TypeScript
- Tailwind CSS (@tailwindcss/vite)
- Vitest（テストフレームワーク）
- GitHub Pages（デプロイ先）

## 開発ルール

### コーディング規約
- **`any`型は使用禁止**
- 関数定義は`const fn = () => {}`形式を使用
- 変数は`const`を優先的に使用
- インポートは`@/`エイリアスを使用
- セミコロンなし（Prettierで自動フォーマット）
- シングルクォート使用

### プロジェクト構成
```
src/
├── components/     # UIコンポーネント
├── hooks/         # カスタムフック
├── utils/         # ユーティリティ関数
├── types/         # 型定義
├── constants/     # 定数定義
└── test/          # テスト関連
```

### コマンド
- `npm run dev` - 開発サーバー起動
- `npm run build` - ビルド
- `npm run test` - テスト実行
- `npm run lint` - ESLint実行
- `npm run format` - Prettierでフォーマット

### 重要な仕様
- ダメージ計算は第三世代の仕様に準拠
- モンテカルロシミュレーション（10,000回）で勝率を算出
- 詳細な仕様は`仕様書.md`を参照

### GitHub Pages デプロイ
ビルド後、`dist`ディレクトリの内容をGitHub Pagesにデプロイします。