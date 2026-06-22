(function(){
  const API = 'https://jaaskel.com';
  const page = location.pathname.replace(/.*\//, '').replace('.html','') || 'index';
  let _start = Date.now(), _maxScroll = 0, _sent = false;

  function scrollDepth() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) _maxScroll = Math.max(_maxScroll, Math.round(window.scrollY / h * 100));
  }
  window.addEventListener('scroll', scrollDepth, {passive: true});

  function sendPageview() {
    if (_sent) return;
    _sent = true;
    const dur = Math.round((Date.now() - _start) / 1000);
    navigator.sendBeacon(API + '/api/pageview', JSON.stringify({
      page: page, ref: document.referrer || '', duration: dur, scroll_depth: _maxScroll
    }));
  }

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') sendPageview();
  });
  window.addEventListener('beforeunload', sendPageview);
  setTimeout(function() { if (!_sent) sendPageview(); }, 300000);

  document.addEventListener('click', function(e) {
    var el = e.target.closest('a, button, .role-card, .card, .service-card, .glass-pill');
    if (!el) return;
    var label = el.textContent.trim().substring(0, 80);
    var tag = el.tagName.toLowerCase();
    if (el.href) label = (el.title || el.innerText || '').trim().substring(0, 80) + ' → ' + el.href.substring(0, 100);
    navigator.sendBeacon(API + '/api/click', JSON.stringify({
      page: page,
      element: tag + (el.className ? '.' + el.className.split(' ')[0] : ''),
      label: label
    }));
  });
})();
