# 📚 Bookmarklet Collection

スマートフォン向けブックマークレットの配布ページです。

## フォルダ構成

```
booklet/
├── index.html              ← 配布ページ（GitHub Pages 等で公開）
├── bookmarklets/           ← ソース管理用（個別JSファイル）
│   ├── copy-title-url.js
│   ├── simple-reader.js
│   ├── yt-timecode-link.js
│   ├── yt-short-url.js
│   └── yt-remove-playlist.js
└── README.md
```

## 収録ブックマークレット

| 名前 | タグ | 説明 |
|------|------|------|
| タイトル＆URLコピー | 便利ツール | ページタイトルとURLをクリップボードにコピー |
| かんたんリーダー | 読みやすさ | ページを中央寄せ・大きめフォントで読みやすく |
| 現在時刻で共有（t=付き） | YouTube | 再生中の秒数を `?t=` に付けた youtu.be URL を生成 |
| 短縮URL（youtu.be）に変換 | YouTube | `watch?v=ID` → `youtu.be/ID` に変換してコピー |
| 再生リストを除去してコピー | YouTube | `list=` / `index=` / `pp=` を除去した純粋な動画URLをコピー |

## 使い方

1. `index.html` を開く（またはホスティングしたURLにアクセス）
2. 使いたいブックマークレットの「コピーする」ボタンをタップ
3. ブラウザのブックマークに新規追加し、URL欄にペーストして保存
4. 任意のページでそのブックマークを実行

## ブックマークレットの追加方法

[index.html](index.html) 内の `bookmarklets` 配列にオブジェクトを追加するだけです：

```js
{
  id: "my-new-bookmarklet",
  tag: "カテゴリ",
  title: "表示名",
  description: "説明文",
  code: `javascript:void(...)`
}
```

`bookmarklets/` フォルダにもソースファイルを置いておくと管理しやすくなります。
