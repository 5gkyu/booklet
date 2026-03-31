// タイトル＆URLコピー
// 閲覧中のページタイトルとURLをクリップボードにコピーします。
javascript:void(function(){
  var t = document.title,
      u = location.href;
  navigator.clipboard.writeText(t + '\n' + u)
    .then(function() { alert('コピーしました!\n' + t); })
    .catch(function() { prompt('コピーしてください:', t + ' ' + u); });
})()
