# SALAN Education — 認定パートナー募集LP

大学受験専門塾 ガリレオ／プラトンの認定パートナー（FC）募集LP。
SALAN — Student-first Advisory, Leveraged Alliance Network

## 構成

```
salan-partner/
├── index.html      ← LP本体（単一HTML・CSS/JSインライン）
├── program.html    ← パートナー向け詳細：認定パートナー制度の詳細
├── support.html    ← パートナー向け詳細：本部サポート体制
├── economics.html  ← パートナー向け詳細：収益モデルの考え方
├── editor.html     ← ブラウザ編集エディタ（STUDIO風・index.html専用）
├── server.js       ← エディタ用ローカルサーバ（Node標準モジュールのみ・install不要）
├── design.md       ← デザイン仕様（トークン・規約・サイト構成）
└── README.md
```

`program.html` / `support.html` / `economics.html` は認定パートナー候補（To B）向けの詳細ページ。LPのヘッダーnav・関連ページセクション・フッターから相互リンクしている。

## 編集方法（2通り）

### A. ブラウザエディタで編集（文字・余白・色の微調整向き）

```bash
node server.js
```

→ http://localhost:3333/editor を開く

- **クリック**で要素選択 → 右パネルでフォントサイズ・行間・色・余白・揃え・太さを調整
- **ダブルクリック**で文字を直接書き換え（枠外クリックで確定）
- **左パネル**：セクション一覧（hero / problem / philosophy / model / ops / benefits / cta / sns / requirements / steps / faq / entry / footer）。ジャンプ・並び替え・複製・削除
- **PC / スマホ390px** 切り替えでレスポンシブ確認
- **⌘S / Ctrl+S で保存** → index.html に書き戻し。`index.backup-日時.html` が自動生成（最新5件）
- ポート競合時: `PORT=3334 node server.js`

編集後は通常どおり commit → push すれば本番に反映される（Netlify連携時）。

### B. コードを直接編集

`index.html` および詳細ページ（`program.html` / `support.html` / `economics.html`）を直接編集して commit。デザイン変更時は `design.md` のトークン・規約に従うこと（オレンジ #DB521F は点のみ、明朝見出し、白↔#F7F7F7交互、プレミアム帯は各ページ2箇所まで）。ブラウザエディタが編集できるのは `index.html` のみ。

## デプロイ（GitHub → Netlify）

1. このフォルダをGitHubリポジトリとしてpush（下記コマンド）
2. Netlify → **Add new site → Import an existing project** → 該当リポジトリを選択
3. Build settings は空でOK（静的HTML）。Publish directory: `/`（ルート）
4. 独自ドメイン割り当て → HTTPS（Let's Encrypt）自動発行を確認

```bash
git init
git add .
git commit -m "feat: SALAN partner LP initial"
git branch -M main
git remote add origin https://github.com/<USER>/salan-partner.git
git push -u origin main
```

以降は push するだけで自動デプロイ。

## 公開前チェックリスト（要確認 6件）

LP内に `要確認` バッジで明示している未確定箇所。確定次第差し替えること。

- [ ] 収益モデル（FAQ内および economics.html：料率・初期条件・広告費の負担区分・管理運営費）
- [ ] 参画のスキル・実績要件（求める人物像および program.html の認定基準）
- [ ] 参画の正式ステップ（参画までの流れおよび program.html の認定プロセス）
- [ ] 開校前後の伴走内容の正式範囲（support.html）
- [ ] フォーム送信先（GAS等のエンドポイント。現状はデモalert）
- [ ] 実績数値・パートナーの声（実データが出た段階で追加。創作禁止）
- [ ] フッターの運営会社表記（新会社 or HYUMA。特商法観点で公開時に必須）

- [ ] 計測タグ（Meta Pixel / GTM）の設置 → meta-pixel-setup の手順に従う
- [ ] 商標：J-PlatPatでSALANの正式検索（簡易確認では教育41類の被りなし）
- [ ] ドメイン取得（salan.jp / salan-education.com 等、DNS未設定を確認済み）

## 注意

- `index.backup-*.html` はエディタの自動バックアップ。gitには含めない（.gitignore済み）
- フォーム送信先が未設定のまま公開しない（ダミーフォーム禁止）
