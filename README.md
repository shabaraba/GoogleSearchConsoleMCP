# Google Search Console MCP

Google Search Console APIとModel Context Protocol (MCP) TypeScript SDKを使用したMCPサーバーの実装です。

## 概要

このサーバーは、Google Search ConsoleのAPIを通じて検索データにアクセスし、MCPプロトコルを通じてそれを利用可能にします。Claude AIやその他のMCPクライアントから、Google Search Consoleのデータに簡単にアクセスできるようになります。

## 機能

1. サイト一覧の取得
2. 検索アナリティクスデータの取得
3. URL検査機能

## セットアップ

### 前提条件

- Node.js 16以上
- Google Cloud Projectと有効なGoogle Search Console API
- Google Search Console APIのOAuth認証情報

### インストール

1. リポジトリをクローン
   ```
   git clone <repository-url>
   cd GoogleSearchConsoleMCP
   ```

2. 依存関係をインストール
   ```
   npm install
   ```

3. Google Search Console API認証情報を設定
   - Google Cloud Consoleで認証情報を作成
   - ダウンロードした認証情報を`credentials.json`として保存

### 実行

開発モードで実行:
```
npm run dev
```

本番用にビルド:
```
npm run build
```

本番モードで実行:
```
npm start
```

MCPサーバーを起動:
```
npm run start-server
```

## Claude Desktopでの使用

Claude Desktopアプリケーションを使用している場合は、以下の手順で簡単に接続できます：

### 方法1: 直接実行（推奨）

Claude Desktopから直接MCPサーバーを起動し、終了時に自動的にシャットダウンします：

1. Claude Desktopのメニューから「Model Context Protocol (MCP)」→「Connect to MCP Server」を選択
2. 「Command to launch MCP server」に以下のいずれかを入力：
   ```
   bun <プロジェクトのパス>/src/claudeDesktopLauncher.ts
   ```
   または
   ```
   bun <プロジェクトのパス>/bun-claude-desktop.ts
   ```
   または
   ```
   npm run claude-desktop
   ```
   ※プロジェクトのディレクトリ内で実行する場合

3. シェバン（#!）付きの実行ファイルを使いたい場合は以下も利用可能：
   ```
   <プロジェクトのパス>/bun-claude-desktop.ts
   ```
   ※bun-claude-desktop.tsに実行権限（chmod +x）がついていることを確認してください

### 方法2: 手動起動

1. MCPサーバーを起動:
   ```bash
   npm run start-server
   ```
   または
   ```bash
   bun src/claudeDesktopLauncher.ts
   ```

2. Claudeを起動し、次のコマンドを実行してMCPサーバーに接続:
   ```
   /mcp connect local:npm/run/start-server
   ```
   または
   ```
   /mcp connect local:bun/src/claudeDesktopLauncher.ts
   ```

### 自動シャットダウン機能について

`claudeDesktopLauncher.ts`は以下の特徴を持っています：

- Claude Desktopから直接実行できるTypeScriptファイル
- Claude Desktop終了時に自動的にシャットダウン
- プロセスシグナル（SIGINT, SIGTERM, SIGHUP）を適切に処理
- 標準入出力を通してClaudeと通信

### 初回セットアップ

初回実行時にGoogle Search Console APIの認証が必要です。認証ブラウザが開いたら、Googleアカウントにログインしてアクセスを許可してください。認証情報は`token.json`ファイルに保存され、以降の実行では自動的に使用されます。

## API エンドポイント

MCP APIは`/api/mcp`で利用可能です。

## 利用可能なツール

### 1. get-sites-list
Google Search Consoleに登録されているサイトの一覧を取得します。

```
/tool get-sites-list
```

### 2. get-search-analytics
特定のサイトの検索アナリティクスデータを取得します。

```
/tool get-search-analytics --siteUrl=https://example.com --startDate=2023-01-01 --endDate=2023-01-31
```

**パラメータ:**
- `siteUrl`: 検索アナリティクスを取得するサイトのURL（必須）
- `startDate`: 開始日（YYYY-MM-DD形式、必須）
- `endDate`: 終了日（YYYY-MM-DD形式、必須）
- `dimensions`: データのグループ化に使用するディメンション（オプション、デフォルト: ["query"]）
- `rowLimit`: 返す行数の上限（オプション、デフォルト: 10）

### 3. inspect-url
URLインスペクションの結果を取得します。

```
/tool inspect-url --siteUrl=https://example.com --inspectionUrl=https://example.com/page.html
```

**パラメータ:**
- `siteUrl`: Search Consoleに登録されているサイトのURL（必須）
- `inspectionUrl`: 検査するURL（必須）

## トラブルシューティング

- **認証エラー**: credentials.jsonが正しいことと、初回認証時にGoogle Search Consoleへのアクセス許可が与えられていることを確認してください。
- **接続エラー**: MCPサーバーが実行中であることを確認し、ポートが競合していないか確認してください。

## ライセンス

ISC