(function(){
  var page = location.pathname.replace(/.*\//, '').replace('.html','').replace('hklkesamajat-','').replace('hklkesamajat','index') || 'index';
  if (page.includes('admin') || page.includes('tietosuoja')) return;

  var T = {
    // ── COMMON ──
    'version':           {fi:'', en:''},
    'footer_contact':    {fi:'yhteydenotto', en:'contact'},
    'footer_privacy':    {fi:'tietosuojaseloste', en:'privacy policy'},
    'footer_service':    {fi:'palvelukuvaus', en:'service description'},

    // ── INDEX ──
    'idx_badge':         {fi:'HKL-Kesämajayhdistys ry · Lauttasaari', en:'HKL Summer Cottage Association · Lauttasaari'},
    'idx_h1':            {fi:'HKL-Kesämajat', en:'HKL Summer Cottages'},
    'idx_sub':           {fi:'Yhdistyksemme vuokraa Helsingin kaupungilta kesämaja-aluetta ja hoitaa sitä. Tarkoituksenamme on edistää ja kehittää kesämajatoimintaa Helsingin Lauttasaaren Länsiulapanniemellä. Järjestämme talkoita, kokouksia, juhlia ja muita yhteisöllisiä tilaisuuksia. Alueemme erityisyytenä ovat oma tanssilava, grillikatos ja venelaiturit.',
                          en:'Our association rents a summer cottage area from the City of Helsinki and takes care of it. We promote and develop summer cottage activities at Länsiulapanniemi in Lauttasaari, Helsinki. We organize work bees, meetings, celebrations and other community events. Our area features a dance pavilion, barbecue shelter and boat docks.'},
    'idx_welcome':       {fi:'Tervetuloa HKL-Kesämajat ry:hyn', en:'Welcome to HKL Summer Cottages'},
    'idx_choose':        {fi:'Valitse roolisi — näet juuri sinulle sopivat tiedot', en:'Choose your role — see information relevant to you'},
    'idx_member':        {fi:'Mökkiläinen', en:'Cottage Owner'},
    'idx_member_tag':    {fi:'Jäsen · kirjautuminen', en:'Member · login'},
    'idx_member_desc':   {fi:'Kirjaudu mökin numerolla. Katso sauna-ajat, mökin live-tila, kameravalvonta ja omat kirjaukset.', en:'Log in with your cottage number. Check sauna schedules, cottage live status, camera surveillance and your records.'},
    'idx_member_btn':    {fi:'Kirjaudu sisään →', en:'Log in →'},
    'idx_visitor':       {fi:'Vierailija', en:'Visitor'},
    'idx_visitor_tag':   {fi:'Avoin · ei kirjautumista', en:'Open · no login required'},
    'idx_visitor_desc':  {fi:'Sää, vedenlämpö, lähipalvelut ja alueen yleistiedot. Kaikille avoin näkymä.', en:'Weather, water temperature, nearby services and area info. Open to everyone.'},
    'idx_visitor_btn':   {fi:'Selaa tietoja →', en:'Browse info →'},
    'idx_support':       {fi:'Tue yhdistystä', en:'Support the association'},
    'idx_support_desc':  {fi:'Vapaavalintainen kannatusmaksu MobilePaylla', en:'Voluntary support payment via MobilePay'},

    // ── HERO PILLS ──
    'pill_temp':         {fi:'📍 Lämpötila', en:'📍 Temperature'},
    'pill_water':        {fi:'🌊 Vesi', en:'🌊 Water'},
    'pill_wind':         {fi:'💨 Tuuli', en:'💨 Wind'},
    'pill_buffetti':     {fi:'☕ Buffetti', en:'☕ Café'},
    'pill_sun':          {fi:'☀️ Aurinko', en:'☀️ Sun'},
    'pill_wave':         {fi:'🌊 Aallonkorkeus', en:'🌊 Wave height'},
    'pill_aqi':          {fi:'🌬️ Ilmanlaatu', en:'🌬️ Air quality'},
    'pill_sealevel':     {fi:'🌊 Vedenpinta', en:'🌊 Sea level'},

    // ── VIERAILIJA ──
    'vis_ingressi':      {fi:'Yhdistyksemme vuokraa Helsingin kaupungilta kesämaja-aluetta ja hoitaa sitä. Edistämme kesämajatoimintaa Lauttasaaren Länsiulapanniemellä — talkoot, juhlat, tanssilava, grillikatos ja venelaiturit.',
                          en:'Our association rents a summer cottage area from the City of Helsinki. We promote cottage activities at Länsiulapanniemi — work bees, celebrations, dance pavilion, barbecue shelter and boat docks.'},
    'vis_algae':         {fi:'🌿 Levätilanne', en:'🌿 Algae status'},
    'vis_pollen':        {fi:'🌸 Siitepöly', en:'🌸 Pollen'},
    'vis_watertemp':     {fi:'Vedenlämpötila', en:'Water temperature'},
    'vis_history_title': {fi:'📜 Historia', en:'📜 History'},
    'vis_history_sub':   {fi:'Raitiotietyöläisten virkistyspaikasta kesämajayhteisöksi', en:'From tram workers\' recreation area to a summer cottage community'},
    'vis_history_text':  {fi:'Vuonna 1932 Helsingin Raitiotie- ja Omnibusyhtiö hankki Lauttasaaren Länsiulapanniemeltä huvila-alueen henkilökuntansa virkistyspaikaksi. Ensimmäisenä kesänä alueella vieraili noin 800 kävijää. Vuosikymmenten saatossa alue kasvoi yhteisölliseksi kesämaja-alueeksi, jossa perinteet — juhannuskokot, elojuhlat ja talkoot — elävät yhä.',
                          en:'In 1932, the Helsinki Tramway and Omnibus Company acquired a villa area at Länsiulapanniemi in Lauttasaari as a recreation spot for its staff. During the first summer, about 800 visitors came to the area. Over the decades, it grew into a communal summer cottage area where traditions — Midsummer bonfires, harvest festivals and work bees — still thrive.'},
    'vis_history_link':  {fi:'Lue koko historiikki (PDF) ↗', en:'Read the full history (PDF) ↗'},
    'vis_cottmap':       {fi:'Mökkikartta', en:'Cottage map'},
    'vis_cottmap_desc':  {fi:'Kesämaja-alueen mökit numerojärjestyksessä · klikkaa avataksesi PDF', en:'Summer cottages by number · click to open PDF'},
    'vis_location':      {fi:'🗺️ Sijainti', en:'🗺️ Location'},
    'vis_gmaps':         {fi:'Avaa Google Mapsissa ↗', en:'Open in Google Maps ↗'},
    'vis_about':         {fi:'Tietoa yhdistyksestä', en:'About the association'},
    'vis_address':       {fi:'Osoite', en:'Address'},
    'vis_services':      {fi:'Palvelut', en:'Services'},
    'vis_services_list': {fi:'Venelaituri, lajittelupiste, kirpputori', en:'Boat dock, recycling point, flea market'},
    'vis_docs':          {fi:'📋 Asiakirjat', en:'📋 Documents'},
    'vis_boats':         {fi:'Vuokraa venepaikka Lauttasaaresta', en:'Rent a boat slip in Lauttasaari'},
    'vis_boats_desc':    {fi:'HKL-Kesämajat ry:n venelaiturit sijaitsevat suojaisassa sijainnissa Länsiulapanniemessä. Merellinen sijainti, helppo pääsy vesille ja turvallinen säilytys.',
                          en:'The boat docks of HKL Summer Cottages are located in a sheltered location at Länsiulapanniemi. Maritime location, easy access to water and safe storage.'},
    'vis_support':       {fi:'Kannatusmaksu', en:'Support payment'},
    'vis_support_desc':  {fi:'HKL-Kesämajat ry ylläpitää ainutlaatuista merellista kesämaja-aluetta Lauttasaaressa. Yhdistys järjestää perinteiset juhannusjuhlat kokkoineen, elojuhlat ja yhteistalkoita. Kannatusmaksullasi tuet alueen kehitystä, yhteistiloja ja tapahtumia.',
                          en:'HKL Summer Cottages maintains a unique maritime summer cottage area in Lauttasaari. The association organizes traditional Midsummer celebrations, harvest festivals and community work bees. Your support payment helps develop the area, shared facilities and events.'},
    'vis_nearby':        {fi:'🏪 Lähipalvelut', en:'🏪 Nearby services'},
    'vis_nearby_sub':    {fi:'Kahvila ja lähimmät palvelut 1,5 km säteellä', en:'Café and nearest services within 1.5 km'},
    'vis_transport':     {fi:'🚌 Julkinen liikenne', en:'🚌 Public transport'},
    'vis_metro':         {fi:'Koivusaari (M) → alue ~15 min', en:'Koivusaari (M) → area ~15 min'},
    'vis_metro_desc':    {fi:'Metroasemalta pohjoiseen, sitten länsirannikon <strong>merenrantapolkua</strong> pitkin ~1,2 km.',
                          en:'From the metro station north, then along the west coast <strong>seaside path</strong> ~1.2 km.'},
    'vis_media':         {fi:'📰 Media & uutiset', en:'📰 Media & news'},
    'vis_media_sub':     {fi:'Lehtijutut ja artikkelit HKL-Kesämajat-alueesta · päivitetään automaattisesti', en:'Articles about HKL Summer Cottages area · updated automatically'},
    'vis_media_fresh':   {fi:'🔴 Tuoreet uutiset · Lauttasaari & Länsiulapanniemi', en:'🔴 Latest news · Lauttasaari & Länsiulapanniemi'},
    'vis_media_archive': {fi:'📰 Mediaseuranta · Länsiulapanniemi & HKL-Kesämajat', en:'📰 Media monitoring · Länsiulapanniemi & HKL Summer Cottages'},
    'vis_members':       {fi:'👥 Muut hallituksen jäsenet', en:'👥 Other board members'},

    // ── MÖKKILÄINEN ──
    'mok_title':         {fi:'Oma mökki', en:'My cottage'},
    'mok_login_sub':     {fi:'HKL-Kesämajat ry · Kirjaudu mökkisi tiedoilla', en:'HKL Summer Cottages · Log in with your cottage details'},
    'mok_coming':        {fi:'📢 Tulossa pian', en:'📢 Coming soon'},
    'mok_coming_desc':   {fi:'Oman mökin rekisteröinti avautuu piakkoin. Saat hallitukselta ohjeet kirjautumistunnusten luomiseen.',
                          en:'Cottage registration opens soon. You will receive instructions from the board for creating login credentials.'},
    'mok_num':           {fi:'Mökin numero (esim. 484)', en:'Cottage number (e.g. 484)'},
    'mok_pass':          {fi:'Salasana', en:'Password'},
    'mok_login_btn':     {fi:'Kirjaudu sisään →', en:'Log in →'},
    'mok_lost_pass':     {fi:'Kadonnut salasana? Ota yhteyttä sihteerin kautta.', en:'Lost password? Contact the secretary.'},
  };

  var _lang = localStorage.getItem('hkl_lang') || 'fi';

  function applyLang(lang) {
    _lang = lang;
    localStorage.setItem('hkl_lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (T[key] && T[key][lang]) {
        if (el.tagName === 'INPUT') el.placeholder = T[key][lang];
        else el.innerHTML = T[key][lang];
      }
    });
    // Update toggle buttons
    document.querySelectorAll('.hkl-lang-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  window.setHklLang = function(lang) { applyLang(lang); };

  // Create language toggle
  var toggle = document.createElement('div');
  toggle.style.cssText = 'position:fixed;top:12px;right:12px;z-index:9997;display:flex;gap:2px;background:rgba(0,0,0,0.3);backdrop-filter:blur(8px);border-radius:8px;padding:3px;';
  toggle.innerHTML = '<button class="hkl-lang-btn" data-lang="fi" onclick="setHklLang(\'fi\')" style="padding:4px 10px;border:none;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;transition:.15s;background:transparent;color:rgba(255,255,255,0.6);">FI</button>'
    + '<button class="hkl-lang-btn" data-lang="en" onclick="setHklLang(\'en\')" style="padding:4px 10px;border:none;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;transition:.15s;background:transparent;color:rgba(255,255,255,0.6);">EN</button>';
  document.body.appendChild(toggle);

  // Style active button
  var style = document.createElement('style');
  style.textContent = '.hkl-lang-btn.active{background:rgba(255,255,255,0.2)!important;color:#fff!important;}';
  document.head.appendChild(style);

  // Apply saved language
  setTimeout(function(){ applyLang(_lang); }, 100);
})();
