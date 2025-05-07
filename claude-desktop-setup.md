# Claude Desktopの設定方法

## エラー対応：パス不一致

エラーログ：
```
error: Module not found "path/to/project/src/index.ts"
```

Claude Desktopが異なるパスを探している場合の対処法です。

## 解決方法

### 1. シンボリックリンクを作成

プロジェクトの場所と実行パスが異なる場合は、シンボリックリンクを作成できます：

```bash
mkdir -p path/to/expected/directory
ln -sf path/to/actual/project/src path/to/expected/directory/src
ln -sf path/to/actual/project/launcher.ts path/to/expected/directory/launcher.ts
```

### 2. Claude Desktopの設定

Claude Desktopの設定で、以下のようなコマンドを使用します：

```
bun ./bin/claude-desktop-launcher.ts
```

### 3. 環境変数の設定（別の解決方法）

Claude Desktopの設定で、環境変数を追加して正しいパスを指定する方法もあります：

1. 「Model Context Protocol (MCP)」→「Connect to MCP Server」を選択
2. 「Environment Variables」セクションで以下を追加：
   ```
   MCP_SERVER_PATH=./
   ```
3. 「Command to launch MCP server」に以下を入力：
   ```
   bun $MCP_SERVER_PATH/bin/claude-desktop-launcher.ts
   ```

どちらかの方法で、Claude Desktopが正しいパスでMCPサーバーを起動できるようになります。