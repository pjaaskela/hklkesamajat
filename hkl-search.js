(function(){
  var page = location.pathname.replace(/.*\//, '').replace('.html','') || 'index';
  if (page.includes('admin') || page.includes('tietosuoja')) return;

  // Build search index from page content
  function buildIndex() {
    var items = [];
    // Section headers
    document.querySelectorAll('.section-header h2, .card-title, .page-title').forEach(function(el) {
      var text = el.textContent.trim();
      if (text.length > 2) items.push({text: text, type: 'otsikko', el: el});
    });
    // Cards and content blocks
    document.querySelectorAll('.card, .contact-card, .info-row, .exam-item, .news-card, .service-card').forEach(function(el) {
      var text = el.textContent.trim().substring(0, 300);
      if (text.length > 5) items.push({text: text, type: 'sisältö', el: el});
    });
    // Opas sections (mokki page)
    document.querySelectorAll('#opas-sections > div').forEach(function(el) {
      var text = el.textContent.trim().substring(0, 500);
      if (text.length > 5) items.push({text: text, type: 'opas', el: el});
    });
    // Links
    document.querySelectorAll('a[href$=".pdf"], a[href*="mailto"]').forEach(function(el) {
      var text = el.textContent.trim();
      if (text.length > 2) items.push({text: text, type: 'linkki', el: el, href: el.href});
    });
    // Glass pills (hero stats)
    document.querySelectorAll('.glass-pill').forEach(function(el) {
      var text = el.textContent.trim();
      if (text.length > 2) items.push({text: text, type: 'tieto', el: el});
    });
    return items;
  }

  function search(query, index) {
    if (!query || query.length < 2) return [];
    var q = query.toLowerCase();
    var words = q.split(/\s+/);
    return index.filter(function(item) {
      var t = item.text.toLowerCase();
      return words.every(function(w) { return t.includes(w); });
    }).slice(0, 12);
  }

  function highlight(text, query) {
    var words = query.toLowerCase().split(/\s+/);
    var result = text.substring(0, 120);
    words.forEach(function(w) {
      if (!w) return;
      var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(re, '<mark style="background:#fef3c7;color:#92400e;padding:0 2px;border-radius:2px;">$1</mark>');
    });
    return result;
  }

  var TYPE_ICONS = {otsikko:'📌', sisältö:'📄', opas:'📖', linkki:'🔗', tieto:'📊'};

  // Create search UI
  var btn = document.createElement('div');
  btn.id = 'hkl-search-btn';
  btn.innerHTML = '🔍';
  btn.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:9998;width:48px;height:48px;background:linear-gradient(135deg,#0e5c3a,#0a4a6e);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:transform .2s;';
  btn.onmouseover = function(){this.style.transform='scale(1.1)';};
  btn.onmouseout = function(){this.style.transform='';};
  btn.onclick = function(){ openSearch(); };
  document.body.appendChild(btn);

  var modal = document.createElement('div');
  modal.id = 'hkl-search-modal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);align-items:flex-start;justify-content:center;padding:60px 20px 20px;';
  modal.onclick = function(e){if(e.target===this)closeSearch();};
  modal.innerHTML = '<div style="background:#fff;border-radius:20px;padding:20px;max-width:540px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-height:80vh;display:flex;flex-direction:column;">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'
    + '<span style="font-size:1.3rem;">🔍</span>'
    + '<input id="hkl-search-input" type="text" placeholder="Hae sivulta..." style="flex:1;padding:12px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:1rem;font-family:inherit;outline:none;" autocomplete="off">'
    + '<button onclick="closeSearch()" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:#999;">✕</button></div>'
    + '<div id="hkl-search-results" style="overflow-y:auto;flex:1;"></div></div>';
  document.body.appendChild(modal);

  var _index = null;

  window.openSearch = function() {
    modal.style.display = 'flex';
    if (!_index) _index = buildIndex();
    var input = document.getElementById('hkl-search-input');
    input.value = '';
    document.getElementById('hkl-search-results').innerHTML = '<div style="color:#999;font-size:0.85rem;text-align:center;padding:20px;">Kirjoita hakusana (vähintään 2 merkkiä)</div>';
    setTimeout(function(){ input.focus(); }, 100);
  };

  window.closeSearch = function() {
    modal.style.display = 'none';
  };

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && modal.style.display === 'flex') closeSearch();
  });

  modal.addEventListener('input', function(e) {
    if (e.target.id !== 'hkl-search-input') return;
    var q = e.target.value.trim();
    var results = search(q, _index || []);
    var el = document.getElementById('hkl-search-results');
    if (q.length < 2) {
      el.innerHTML = '<div style="color:#999;font-size:0.85rem;text-align:center;padding:20px;">Kirjoita hakusana (vähintään 2 merkkiä)</div>';
      return;
    }
    if (!results.length) {
      el.innerHTML = '<div style="color:#999;font-size:0.85rem;text-align:center;padding:20px;">Ei tuloksia haulle "' + q + '"</div>';
      return;
    }
    el.innerHTML = results.map(function(r, i) {
      var icon = TYPE_ICONS[r.type] || '📄';
      var snippet = highlight(r.text, q);
      return '<div class="hkl-sr" data-idx="' + i + '" style="display:flex;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:background .15s;border-bottom:1px solid #f0f0f0;" onmouseover="this.style.background=\'#f0fdf4\'" onmouseout="this.style.background=\'\'">'
        + '<span style="font-size:1.1rem;flex-shrink:0;margin-top:2px;">' + icon + '</span>'
        + '<div style="flex:1;min-width:0;"><div style="font-size:0.82rem;font-weight:600;color:#1a5c3a;margin-bottom:2px;">' + snippet + '</div>'
        + '<div style="font-size:0.68rem;color:#999;">' + r.type + '</div></div></div>';
    }).join('');

    el.querySelectorAll('.hkl-sr').forEach(function(item, i) {
      item.onclick = function() {
        var r = results[i];
        closeSearch();
        if (r.href) { window.open(r.href, '_blank'); return; }
        if (r.el) {
          r.el.scrollIntoView({behavior:'smooth', block:'center'});
          r.el.style.outline = '2px solid #52b788';
          r.el.style.outlineOffset = '4px';
          setTimeout(function(){ r.el.style.outline=''; r.el.style.outlineOffset=''; }, 3000);
        }
      };
    });
  });
})();
