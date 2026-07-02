#!/usr/bin/env node
/**
 * LP Editor Server (依存ゼロ・Node標準モジュールのみ)
 * 使い方: LPの index.html があるフォルダでこのファイルと editor.html を置いて
 *   node server.js
 * → http://localhost:3333/editor を開く
 *
 * エンドポイント:
 *   GET  /editor  エディタUI
 *   GET  /lp      編集対象の index.html
 *   GET  /*       同フォルダの静的ファイル(画像等)
 *   POST /save    編集後HTMLを index.html に書き戻し(自動バックアップ付き)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3333;
const ROOT = process.cwd();
const LP_FILE = path.join(ROOT, 'index.html');
const EDITOR_FILE = path.join(__dirname, 'editor.html');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  // 保存
  if (req.method === 'POST' && url === '/save') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const { html } = JSON.parse(body);
        if (!html || html.length < 100) return send(res, 400, JSON.stringify({ ok: false, error: 'HTMLが空です' }), 'application/json');
        // バックアップ
        if (fs.existsSync(LP_FILE)) {
          const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          fs.copyFileSync(LP_FILE, path.join(ROOT, `index.backup-${ts}.html`));
          // バックアップは最新5件のみ保持
          const backups = fs.readdirSync(ROOT).filter((f) => f.startsWith('index.backup-')).sort();
          while (backups.length > 5) fs.unlinkSync(path.join(ROOT, backups.shift()));
        }
        fs.writeFileSync(LP_FILE, html, 'utf8');
        console.log(`[saved] index.html (${(html.length / 1024).toFixed(1)} KB)`);
        send(res, 200, JSON.stringify({ ok: true }), 'application/json');
      } catch (e) {
        send(res, 500, JSON.stringify({ ok: false, error: String(e) }), 'application/json');
      }
    });
    return;
  }

  // エディタUI
  if (url === '/' || url === '/editor') {
    return send(res, 200, fs.readFileSync(EDITOR_FILE), MIME['.html']);
  }

  // 編集対象LP
  if (url === '/lp') {
    if (!fs.existsSync(LP_FILE)) return send(res, 404, 'index.html が見つかりません。LPフォルダで起動してください。');
    return send(res, 200, fs.readFileSync(LP_FILE), MIME['.html']);
  }

  // 静的ファイル(画像など)
  const filePath = path.join(ROOT, url);
  if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return send(res, 200, fs.readFileSync(filePath), MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
  }

  send(res, 404, 'Not Found');
});

server.listen(PORT, () => {
  console.log('==============================');
  console.log(' LP Editor 起動');
  console.log(` 編集画面: http://localhost:${PORT}/editor`);
  console.log(` 対象ファイル: ${LP_FILE}`);
  console.log(' 終了: Ctrl + C');
  console.log('==============================');
});
