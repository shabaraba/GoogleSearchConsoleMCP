# Claude Desktopの設定方法

## エラー対応：パス不一致

エラーログ：
```
error: Module not found "/Users/t002451/my_work/private/google-search-console-server/src/index.ts"
```

Claude Desktopが`/Users/t002451/my_work/private/google-search-console-server/`を探していますが、正しいパスは`/Users/t002451/my_work/private/GoogleSearchConsoleMCP/`です。

## 解決方法

### 1. シンボリックリンクを作成

以下のコマンドでシンボリックリンクを作成します：

```bash
mkdir -p /Users/t002451/my_work/private/google-search-console-server
ln -sf /Users/t002451/my_work/private/GoogleSearchConsoleMCP/src /Users/t002451/my_work/private/google-search-console-server/src
ln -sf /Users/t002451/my_work/private/GoogleSearchConsoleMCP/bun-claude-desktop.ts /Users/t002451/my_work/private/google-search-console-server/bun-claude-desktop.ts
```

### 2. Claude Desktopの設定

Claude Desktopの設定で、以下のコマンドを使用します：

```
bun /Users/t002451/my_work/private/google-search-console-server/bun-claude-desktop.ts
```

### 3. 環境変数の設定（別の解決方法）

Claude Desktopの設定で、環境変数を追加して正しいパスを指定します：

1. 「Model Context Protocol (MCP)」→「Connect to MCP Server」を選択
2. 「Environment Variables」セクションで以下を追加：
   ```
   MCP_SERVER_PATH=/Users/t002451/my_work/private/GoogleSearchConsoleMCP
   ```
3. 「Command to launch MCP server」に以下を入力：
   ```
   bun $MCP_SERVER_PATH/bun-claude-desktop.ts
   ```

どちらかの方法で、Claude Desktopが正しいパスでMCPサーバーを起動できるようになります。