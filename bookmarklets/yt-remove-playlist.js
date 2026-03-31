// 再生リストを除去してコピー
// YouTubeのURLから list= / index= / pp= などの再生リスト情報を取り除いた
// 純粋な動画URLをコピーします。余分なパラメータなしで共有したいときに。
javascript:void(function(){
  var u = new URL(location.href);
  u.searchParams.delete('list');
  u.searchParams.delete('index');
  u.searchParams.delete('pp');
  var url = u.toString();
  navigator.clipboard.writeText(url)
    .then(function() { alert('再生リスト除去済みURLをコピーしました!\n' + url); })
    .catch(function() { prompt('コピーしてください:', url); });
})()
