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
    if (!el || el.closest('#hkl-beta-modal')) return;
    var label = el.textContent.trim().substring(0, 80);
    var tag = el.tagName.toLowerCase();
    if (el.href) label = (el.title || el.innerText || '').trim().substring(0, 80) + ' → ' + el.href.substring(0, 100);
    navigator.sendBeacon(API + '/api/click', JSON.stringify({
      page: page,
      element: tag + (el.className ? '.' + el.className.split(' ')[0] : ''),
      label: label
    }));
  });

  // Beta feedback banner (22.6.–29.6.2026)
  var now = new Date();
  var start = new Date('2026-06-22T00:00:00+03:00');
  var end = new Date('2026-06-30T00:00:00+03:00');
  if (now >= start && now < end && !page.includes('admin')) {
    var badge = document.createElement('div');
    badge.id = 'hkl-beta-badge';
    badge.innerHTML = '🧪 <span>BETA</span> Anna palautetta';
    badge.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:linear-gradient(135deg,#0e5c3a,#0a4a6e);color:#fff;padding:10px 18px;border-radius:30px;font-size:0.82rem;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;transition:transform .2s;';
    badge.querySelector('span').style.cssText = 'background:#52b788;color:#0a1a10;padding:2px 8px;border-radius:10px;font-size:0.65rem;letter-spacing:0.08em;';
    badge.onmouseover = function(){this.style.transform='scale(1.05)';};
    badge.onmouseout = function(){this.style.transform='';};
    badge.onclick = function(){ document.getElementById('hkl-beta-modal').style.display='flex'; };
    document.body.appendChild(badge);

    var modal = document.createElement('div');
    modal.id = 'hkl-beta-modal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);align-items:center;justify-content:center;padding:20px;';
    modal.onclick = function(e){if(e.target===this)this.style.display='none';};
    modal.innerHTML = '<div style="background:#fff;border-radius:20px;padding:28px;max-width:440px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
      + '<div style="font-size:1.1rem;font-weight:800;color:#0e5c3a;">🧪 Anna palautetta</div>'
      + '<button onclick="document.getElementById(\'hkl-beta-modal\').style.display=\'none\'" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#999;">✕</button></div>'
      + '<p style="font-size:0.85rem;color:#666;margin-bottom:14px;line-height:1.5;">Sivusto on beta-vaiheessa. Kerro mikä toimii, mikä ei tai mitä toivoisit!</p>'
      + '<textarea id="hkl-fb-msg" placeholder="Kirjoita palautteesi tähän..." style="width:100%;min-height:100px;padding:12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.9rem;font-family:inherit;resize:vertical;outline:none;" onfocus="this.style.borderColor=\'#52b788\'" onblur="this.style.borderColor=\'#e2e8f0\'"></textarea>'
      + '<input id="hkl-fb-contact" type="text" placeholder="Yhteystieto (valinnainen)" style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.85rem;margin-top:8px;outline:none;" onfocus="this.style.borderColor=\'#52b788\'" onblur="this.style.borderColor=\'#e2e8f0\'">'
      + '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;">'
      + '<button onclick="document.getElementById(\'hkl-beta-modal\').style.display=\'none\'" style="padding:10px 18px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#666;font-size:0.85rem;cursor:pointer;">Peruuta</button>'
      + '<button id="hkl-fb-send" onclick="sendFeedback()" style="padding:10px 22px;border-radius:10px;border:none;background:#0e5c3a;color:#fff;font-weight:700;font-size:0.85rem;cursor:pointer;">Lähetä</button></div>'
      + '<div id="hkl-fb-status" style="font-size:0.8rem;margin-top:8px;min-height:1.2em;text-align:center;"></div></div>';
    document.body.appendChild(modal);

    window.sendFeedback = function() {
      var msg = document.getElementById('hkl-fb-msg').value.trim();
      var contact = document.getElementById('hkl-fb-contact').value.trim();
      var status = document.getElementById('hkl-fb-status');
      if (!msg) { status.style.color='#f87171'; status.textContent='Kirjoita palaute ensin'; return; }
      status.style.color='#52b788'; status.textContent='Lähetetään...';
      fetch(API + '/api/feedback', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({page: page, message: msg, contact: contact})
      }).then(function(r) {
        if (r.ok) {
          status.textContent = '✓ Kiitos palautteestasi!';
          document.getElementById('hkl-fb-msg').value = '';
          document.getElementById('hkl-fb-contact').value = '';
          setTimeout(function(){ document.getElementById('hkl-beta-modal').style.display='none'; status.textContent=''; }, 2000);
        } else { status.style.color='#f87171'; status.textContent='Virhe — yritä uudelleen'; }
      }).catch(function(){ status.style.color='#f87171'; status.textContent='Verkkovirhe'; });
    };
  }
})();
