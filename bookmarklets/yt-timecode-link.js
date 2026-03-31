// 現在時刻で共有（t=付き）
// YouTubeで再生中の時刻から始まる共有リンク（youtu.be形式）を生成してコピーします。
//
// 仕様:
//   - URLパラメータ ?t=秒数 を付与することで指定秒数から再生開始できる
//   - youtu.be/VIDEO_ID?t=秒数 形式で出力
//   - 再生位置が 0 秒の場合は t= を付けない
javascript:void(function(){
  var v = document.querySelector('video');
  if (!v) {
    alert('動画が見つかりません\nYouTubeの動画ページで実行してください');
    return;
  }
  var p  = new URLSearchParams(location.search),
      id = p.get('v') || location.pathname.slice(1);
  if (!id) {
    alert('動画IDが取得できません');
    return;
  }
  var t   = Math.floor(v.currentTime),
      url = 'https://youtu.be/' + id + (t > 0 ? '?t=' + t : '');
  navigator.clipboard.writeText(url)
    .then(function() { alert('コピーしました!\n' + url); })
    .catch(function() { prompt('コピーしてください:', url); });
})()
