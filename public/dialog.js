window.showVersionDialog = function () {
  const bg = document.createElement('div');
  bg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999';
  bg.innerHTML =
    '<div style="background:#fff;border-radius:8px;min-width:360px;padding:24px;font-family:Segoe UI,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.12)">' +
      '<h3 style="margin:0 0 16px;font-size:18px">info</h3>' +
      '<p style="margin:0 0 24px">当前通道的版本可能不是最新版本，下载后请手动检查是否有更新。</p>' +
      '<div style="text-align:right">' +
        '<button class="btn-dl secondary" style="margin-right:12px;background:#888" onclick="this.parentElement.parentElement.parentElement.remove()">算了</button>' +
        '<button class="btn-dl" onclick="window.open(\'https://baidu.com\',\'_blank\');this.parentElement.parentElement.parentElement.remove()">是，前往检查</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(bg);
};
