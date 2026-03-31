// かんたんリーダー
// ページの本文を中央寄せ・大きめフォントにして読みやすく整えます。
javascript:void(function(){
  var d = document,
      b = d.body;
  b.style.maxWidth  = '640px';
  b.style.margin    = '0 auto';
  b.style.padding   = '16px';
  b.style.fontSize  = '18px';
  b.style.lineHeight = '1.8';
  b.style.color     = '#333';
  b.style.background = '#fefefe';
  var imgs = d.querySelectorAll('img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.maxWidth = '100%';
    imgs[i].style.height   = 'auto';
  }
  alert('読みやすくしました!');
})()
