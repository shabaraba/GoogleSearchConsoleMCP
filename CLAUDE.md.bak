# Google Search Console MCP

このプロジェクトはGoogle Search Console APIをModel Context Protocol (MCP)経由で利用できるようにするサーバーを実装しています。

## 自動起動設定

Claude Desktopは起動時に自動的にMCPサーバーを起動し、終了時に自動的に停止します。
これにより手動でサーバーを起動・停止する必要がなくなります。

## MCPサーバーの接続方法

Claude内でMCPサーバーに接続するには、以下のコマンドを使用します：

```
/mcp connect local:npm/run/start-server
```

## 利用可能なツール

このMCPサーバーでは以下のツールが利用できます：

### 1. get-sites-list

Google Search Consoleに登録されているサイトの一覧を取得します。

```
/tool get-sites-list
```

### 2. get-search-analytics

特定のサイトの検索アナリティクスデータを取得します。

```
/tool get-search-analytics --siteUrl=https://example.com --startDate=2023-01-01 --endDate=2023-01-31 --dimensions=["query"] --rowLimit=10
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

## 使用例

1. まずSearch Consoleのサイト一覧を取得：
```
/tool get-sites-list
```

2. 特定のサイトの検索パフォーマンスデータを分析：
```
/tool get-search-analytics --siteUrl=https://example.com --startDate=2023-01-01 --endDate=2023-01-31 --dimensions=["query","page"] --rowLimit=20
```

3. 特定のURLのインデックス状態を確認：
```
/tool inspect-url --siteUrl=https://example.com --inspectionUrl=https://example.com/important-page.html
```

## トラブルシューティング

自動起動が機能しない場合は、以下のコマンドを使用して手動でサーバーを起動できます：

```
cd プロジェクトのディレクトリ
npm run start-server
```

別のターミナルで上記のコマンドを実行してから、Claudeで接続してください。