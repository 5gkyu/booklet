// ② ニコニコ マイリスト追加
// ニコニコ動画のマイリストページで実行する。
// ①「Kiite 動画IDを抽出」がクリップボードにコピーしたJSONを
// prompt に貼り付けて動画IDを受け取り、マイリストへ登録する。
//
// ※ localStorage はドメイン別のため kiite.jp → nicovideo.jp 間では共有できない。
//   そのため①のクリップボードコピー経由で渡す。
//
// 前提:
//   - ログイン済みのニコニコアカウントでアクセスしていること
//   - URL が /my/mylist/{id} または /mylist/{id} の形式であること
//   - 先に「① Kiite 動画IDを抽出」を実行してクリップボードにコピー済みであること
//
// レート制限対策:
//   - 1件ごとに 500ms 待機（nvapi の非公式制限を考慮）
//   - 409 Conflict（重複）は失敗にカウントせずスキップ扱いにする


javascript:void((async function(){

  try {

  // ── マイリストIDを URL から取得 ──
  var m = (location.pathname || '').match(/\/mylist\/(\d+)/);
  if (!m) {
    alert('ニコニコのマイリストページで実行してください。\n例: https://www.nicovideo.jp/my/mylist/123456');
    return;
  }
  var mylistId = m[1];

  // ── prompt でIDリストを受け取る（クリップボードから貼り付け） ──
  // ①の出力形式: [{id:"sm123",memo:"コメント"}, ...]
  // 旧形式 ["sm123", ...] にも対応
  var raw = prompt(
    '①で取得したIDリストを貼り付けてください:\n'
    + '（① 実行後にクリップボードへコピー済みのJSON）'
  );
  if (!raw) { return; }

  var parsed;
  try { parsed = JSON.parse(raw); } catch(e) {
    alert('形式エラー。①を再実行してください。');
    return;
  }

  if (!parsed || !parsed.length) {
    alert('IDリストが空です。');
    return;
  }

  // 旧形式（文字列配列）も受け付ける
  var items = parsed.map(function(x) {
    return typeof x === 'string' ? { id: x, memo: '' } : x;
  });

  // ── 確認ダイアログ ──
  var ok = confirm(
    items.length + ' 件をマイリスト(ID: ' + mylistId + ')に追加します。\n'
    + '1000ms 間隔で登録（レート制限対策）。\n'
    + '完了まで約 ' + Math.ceil(items.length * 1.0) + ' 秒\n'
    + 'よろしいですか？'
  );
  if (!ok) return;

  var success = 0, fail = 0, skip = 0, firstErr = '';

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var id   = item.id;
    var memo = item.memo || '';
    try {
      // description はクエリパラメータで付与（実績のある形式）
      var d = memo ? encodeURI(memo) : '';
      var url = 'https://nvapi.nicovideo.jp/v1/users/me/mylists/'
        + encodeURIComponent(mylistId)
        + '/items?itemId='
        + encodeURIComponent(id)
        + (d ? '&description=' + d : '');
      var res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'X-Frontend-Id': '6',
          'X-Frontend-Version': '0',
          'X-Request-With': location.origin
        }
      });

      if (res && res.ok) {
        success++;
      } else if (res && res.status === 409) {
        // すでにマイリスト登録済み → スキップ
        skip++;
      } else {
        fail++;
        if (!firstErr) firstErr = 'HTTP ' + res.status + ' (' + id + ')';
      }
    } catch(e) {
      fail++;
      if (!firstErr) firstErr = String(e) + ' (' + id + ')';
    }

    // レート制限対策: 最後の1件以外は 1000ms 待機
    if (i < items.length - 1) {
      await new Promise(function(r) { setTimeout(r, 1000); });
    }
  }

  alert(
    '完了！\n\n'
    + '✅ 成功:         ' + success + ' 件\n'
    + '⏭ スキップ(重複): ' + skip    + ' 件\n'
    + '❌ 失敗:         ' + fail    + ' 件\n'
    + (firstErr ? '\n最初のエラー:\n' + firstErr + '\n' : '')
    + '\nページを更新して確認してください。'
  );
  location.reload();

  } catch(e) { alert('エラー: ' + e); }

})())
