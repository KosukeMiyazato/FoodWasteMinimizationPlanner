# FoodWasteMinimizationPlanner-

## 概要
食品廃棄を最小化するための最適化システムです。在庫管理、レシピデータベース、数理最適化エンジンを組み合わせて、効率的な食事計画を生成します。

## 機能

### 🔐 認証システム
- メールアドレス + パスワード認証
- 初回登録時のメール認証
- セキュアなパスワード設定
- JWT ベースのセッション管理

### 📦 在庫管理
- 食材の追加・削除・編集
- 賞味期限の追跡
- カテゴリ別管理
- 緊急度の可視化

### 👨‍🍳 レシピデータベース
- レシピの登録・管理
- 材料の在庫状況確認
- 栄養成分の表示
- カテゴリ別フィルタリング

### 🎯 最適化エンジン
- 数理最適化による食事計画生成
- 廃棄最小化アルゴリズム
- 栄養バランスの考慮
- 制約条件の設定

### 📊 食事計画
- 最適化された食事プラン
- 廃棄予測と効率性指標
- 栄養サマリー
- 材料使用量の詳細

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- Tailwind CSS
- Lucide React (アイコン)
- React Router

### バックエンド・認証
- AWS DynamoDB (データベース)
- bcryptjs (パスワードハッシュ化)
- jsonwebtoken (JWT認証)
- nodemailer (メール送信)

### 最適化
- カスタム数理最適化エンジン
- 整数線形計画法ベース
- 貪欲法 + 局所探索

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example` を `.env` にコピーして、必要な値を設定してください。

```bash
cp .env.example .env
```

### 3. DynamoDB テーブルの作成
AWS DynamoDB に以下の設定でテーブルを作成してください：

**テーブル名**: `AuthTable`
**パーティションキー**: `PK` (String)
**ソートキー**: `SK` (String)

**グローバルセカンダリインデックス**:
- インデックス名: `email-index`
- パーティションキー: `email` (String)
- ソートキー: `SK` (String)

### 4. 開発サーバーの起動
```bash
npm run dev
```

## 認証システムの詳細

### データモデル
DynamoDB の単一テーブル設計を採用：

**User アイテム**
- PK: `USER#<id>`
- SK: `META`
- 属性: email, passwordHash, isActive, createdAt, lastLoginAt

**Token アイテム**
- PK: `USER#<id>`
- SK: `TOKEN#<uuid>`
- 属性: tokenHash, purpose, expiresAt, usedAt, createdAt

### セキュリティ機能
- パスワードの bcrypt ハッシュ化
- トークンの HMAC-SHA256 ハッシュ化
- 一回限り使用可能なトークン
- 24時間の有効期限
- TransactWriteItems による原子的更新

### 登録フロー
1. メールアドレス入力
2. DynamoDB にユーザー作成
3. 初期設定トークン発行
4. 確認メール送信
5. メールリンクからパスワード設定
6. ログイン可能

## 数理最適化の詳細

### 目的関数
```
minimize: Σ(weight_i × w_i) + ε × Σ(x_r)
```

### 制約条件
- 在庫バランス制約
- 最小サービング数制約
- 最大料理数制約
- 栄養制約

### アルゴリズム
1. 実行可能レシピの抽出
2. 貪欲法による初期解生成
3. 局所探索による改善
4. 制約充足性確認

## 多言語対応
- 日本語・英語対応
- コンテキストベースの翻訳システム
- UI の動的言語切り替え

## ライセンス
MIT License

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/KosukeMiyazato/FoodWasteMinimizationPlanner-)