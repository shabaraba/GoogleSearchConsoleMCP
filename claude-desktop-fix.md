# Claude Desktop修正内容

## 問題点

1. Claude Desktopが間違ったパス(`/Users/t002451/my_work/private/google-search-console-server/`)を探している
2. カレントディレクトリが `/` (ルート)になっているため認証情報ファイルが見つからない
3. コンソール出力が `console.log` で行われており、Claude Desktopで表示されない

## 修正内容

1. リダイレクターの作成
   - `/Users/t002451/my_work/private/google-search-console-server/` ディレクトリにリダイレクト用ファイルを配置
   - 実際の実装を指すようにインポート設定

2. カレントディレクトリの変更
   - 全てのスタートアップファイルで `process.chdir('/Users/t002451/my_work/private/GoogleSearchConsoleMCP')` を追加
   - 実行前に正しいプロジェクトディレクトリに移動するように変更

3. ログ出力の変更
   - `console.log` を `console.error` に変更してClaude Desktopに表示されるようにした
   - より詳細なログ情報の追加

## 使用方法

Claude Desktopで以下のコマンドを使用:

```
bun /Users/t002451/my_work/private/google-search-console-server/bun-claude-desktop.ts
```

これでMCPサーバーが正しく起動し、Claude Desktopが終了すると自動的にシャットダウンします。

## 確認事項

1. `credentials.json` が `/Users/t002451/my_work/private/GoogleSearchConsoleMCP/` にあることを確認
2. 実行権限があることを確認 (`chmod +x /Users/t002451/my_work/private/google-search-console-server/bun-claude-desktop.ts`)