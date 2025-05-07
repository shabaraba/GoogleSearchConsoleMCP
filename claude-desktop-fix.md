# Claude Desktop修正内容

## 問題点

1. Claude Desktopが間違ったパス(別のパス)を探している
2. カレントディレクトリが `/` (ルート)になっているため認証情報ファイルが見つからない
3. コンソール出力が `console.log` で行われており、Claude Desktopで表示されない

## 修正内容

1. リダイレクターの作成
   - プロジェクトの代替パスにリダイレクト用ファイルを配置
   - 実際の実装を指すようにインポート設定

2. カレントディレクトリの変更
   - スタートアップファイルで実行スクリプトからの相対パスでプロジェクトルートに移動するよう変更
   - 実行前に正しいプロジェクトディレクトリに移動するように変更

3. ログ出力の変更
   - `console.log` を `console.error` に変更してClaude Desktopに表示されるようにした
   - より詳細なログ情報の追加

## 使用方法

Claude Desktopで以下のコマンドを使用:

```
bun ./bin/claude-desktop-launcher.ts
```

これでMCPサーバーが正しく起動し、Claude Desktopが終了すると自動的にシャットダウンします。

## 確認事項

1. `credentials.json` がプロジェクトルートにあることを確認
2. 実行権限があることを確認 (`chmod +x ./bin/claude-desktop-launcher.ts`)