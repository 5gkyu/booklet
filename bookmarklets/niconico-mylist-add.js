// ② ニコニコ マイリスト追加
// ニコニコ動画のマイリストページで実行する。
// Kiiteの抽出ブックマークレット（①）が localStorage["kiite_ids"] に
// 保存した動画IDを順番にマイリストへ登録する。
//
// 前提:
//   - ログイン済みのニコニコアカウントでアクセスしていること
//   - URL が /my/mylist/{id} または /mylist/{id} の形式であること
//   - 先に「① Kiite 動画IDを抽出」ブックマークレットを実行済みであること
//
// レート制限対策:
//   - 1件ごとに 500ms 待機（nvapi の非公式制限を考慮）
//   - 409 Conflict（重複）は失敗にカウントせずスキップ扱いにする
//
javascript:void((async function(){

  // ── localStorage からIDリストを取得 ──
  var raw;
  try { raw = localStorage.getItem('kiite_ids'); } catch(e) {}

  if (!raw) {
    alert('動画IDが見つかりません。\n先に Kiite のページで\n「① Kiite 動画IDを抽出」を実行してください。');
    return;
  }

  var ids;
  try { ids = JSON.parse(raw); } catch(e) {
    alert('IDデータが壊れています。\nKiite ページで再度抽出してください。');
    return;
  }

  if (!ids || !ids.length) {
    alert('IDリストが空です。');
    return;
  }

  // ── マイリストIDを URL から取得 ──
  var m = (location.pathname || '').match(/\/mylist\/(\d+)/);
  if (!m) {
    alert('ニコニコのマイリストページで実行してください。\n例: https://www.nicovideo.jp/my/mylist/123456');
    return;
  }
  var mylistId = m[1];

  // ── 確認ダイアログ ──
  var ok = confirm(
    ids.length + ' 件をマイリスト(ID: ' + mylistId + ')に追加します。\n\n'
    + '500ms 間隔で順番に登録します（レート制限対策）。\n'
    + '完了まで約 ' + Math.ceil(ids.length * 0.5) + ' 秒かかります。\n\n'
    + 'よろしいですか？'
  );
  if (!ok) return;

  var success = 0, fail = 0, skip = 0;

  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    try {
      var res = await fetch(
        'https://nvapi.nicovideo.jp/v1/users/me/mylists/'
          + encodeURIComponent(mylistId)
          + '/items?itemId='
          + encodeURIComponent(id),
        {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'accept': '*/*',
            'x-request-with': 'nicovideo',
            'x-frontend-id': '3',
            'x-client-os-type': 'ios'
          }
        }
      );

      if (res && res.ok) {
        success++;
      } else if (res && res.status === 409) {
        // すでにマイリスト登録済み → スキップ
        skip++;
      } else {
        fail++;
      }
    } catch(e) {
      fail++;
    }

    // レート制限対策: 最後の1件以外は 500ms 待機
    if (i < ids.length - 1) {
      await new Promise(function(r) { setTimeout(r, 500); });
    }
  }

  alert(
    '完了！\n\n'
    + '✅ 成功:         ' + success + ' 件\n'
    + '⏭ スキップ(重複): ' + skip    + ' 件\n'
    + '❌ 失敗:         ' + fail    + ' 件\n\n'
    + 'ページを更新して確認してください。'
  );

})())
