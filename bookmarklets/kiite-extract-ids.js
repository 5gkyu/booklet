// Kiite → 動画ID抽出
// KiiteのプレイリストページでHTML（data-* 属性）から
// ニコニコ動画の動画ID（sm/nm形式）を抜き出し、
// localStorage と クリップボードに保存する。
//
// ── 抽出の優先順位 ──
// 1. data-type="song" かつ data-video-id 属性を持つ要素
// 2. data-video-id 属性を持つすべての要素（より広いfallback）
// 3. <a href> の中に /sm\d+ / /nm\d+ パターンがあるリンク
//
// 保存先: localStorage["kiite_ids"] = JSON.stringify(["sm12345", ...])
//
javascript:void(function(){
  // ── Step1: data-type="song" から取得（メインパス） ──
  var blocks = document.querySelectorAll('[data-type="song"][data-video-id]');

  // ── Step2: fallback — data-video-id 全体 ──
  if (!blocks.length) {
    blocks = document.querySelectorAll('[data-video-id]');
  }

  var seen  = new Set();
  var items = []; // [{id, memo}, ...] 形式で保存

  Array.prototype.forEach.call(blocks, function(el) {
    var id = el.getAttribute('data-video-id') || '';
    id = id.trim().toLowerCase();
    if (id && /^(sm|nm)\d+$/.test(id) && !seen.has(id)) {
      seen.add(id);

      // コメント取得: まず要素自身の中を検索、なければ親にさかのぼる
      var memo = '';
      var ct = el.querySelector('.playlist-cmnt-txt');
      if (!ct) {
        var p = el;
        for (var i = 0; i < 6; i++) {
          p = p && p.parentElement;
          if (!p) break;
          ct = p.querySelector('.playlist-cmnt-txt');
          if (ct) break;
        }
      }
      if (ct) memo = ct.textContent.trim();

      items.push({ id: id, memo: memo });
    }
  });

  // ── Step3: fallback — <a href> 内の sm/nm パターン（コメントなし） ──
  if (!items.length) {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var m = (a.href || '').match(/\/(sm|nm)(\d+)/i);
      if (m) {
        var id = (m[1] + m[2]).toLowerCase();
        if (!seen.has(id)) { seen.add(id); items.push({ id: id, memo: '' }); }
      }
    });
  }

  if (!items.length) {
    alert('動画IDが見つかりませんでした。\nKiiteのプレイリストページで実行してください。');
    return;
  }

  // ── localStorage に保存 ──
  try {
    localStorage.setItem('kiite_ids', JSON.stringify(items));
  } catch(e) { /* プライベートブラウジング等で書き込めない場合は無視 */ }

  // ── クリップボードにも保存（フォールバックあり） ──
  var msg = '✅ ' + items.length + ' 件を取得しました（コメント付き）！\n\n'
          + 'ニコニコのマイリストページで\n「② ニコニコ マイリスト追加」ブックマークレットを実行してください。';

  navigator.clipboard.writeText(JSON.stringify(items))
    .then(function()  { alert(msg + '\n（クリップボードにコピーしました）'); })
    .catch(function() { alert(msg); });
})()
