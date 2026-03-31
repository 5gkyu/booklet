// 短縮URL（youtu.be）に変換
// youtube.com/watch?v=… の長いURLを youtu.be/… の短縮URLに変換してコピーします。
javascript:void(function(){
  var p  = new URLSearchParams(location.search),
      id = p.get('v');
  if (!id) {
    alert('YouTube動画ページで実行してください');
    return;
  }
  var url = 'https://youtu.be/' + id;
  navigator.clipboard.writeText(url)
    .then(function() { alert('短縮URLをコピーしました!\n' + url); })
    .catch(function() { prompt('コピーしてください:', url); });
})()
