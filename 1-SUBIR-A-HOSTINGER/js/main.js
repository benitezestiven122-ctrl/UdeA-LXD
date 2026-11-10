/* main.js — Ser profe en la era de la IA
 * Comportamiento compartido de todas las páginas. Sin librerías.
 * El progreso de las sesiones y la bitácora se guardan en localStorage:
 * es una demostración local, no una entrega académica real.
 */
(function () {
  'use strict';

  var KEY = 'ser-profe-ia-demo-v1';
  var NOTICE_KEY = 'ser-profe-ia-aviso-v1';
  var TOTAL = 10;
  var root = document.body.getAttribute('data-root') || '';
  var page = document.body.getAttribute('data-page');

  var ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
  var ICON_ARROW = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"></path></svg>';

  /* ---------- Datos locales ---------- */
  function emptyState() { return { v: 1, profile: 'guiado', completed: {}, drafts: {} }; }
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.v === 1) return s;
      }
    } catch (e) { /* sin almacenamiento: se usa un estado vacío */ }
    return emptyState();
  }
  // Devuelve true solo si el dato quedó guardado de verdad.
  function save() {
    try {
      var json = JSON.stringify(state);
      window.localStorage.setItem(KEY, json);
      return window.localStorage.getItem(KEY) === json;
    } catch (e) { return false; }
  }
  // ?reset=1 en la URL deja la demostración en cero (útil para iniciar cada prueba de Maze igual).
  try {
    var startParams = new URLSearchParams(window.location.search);
    if (startParams.get('reset') === '1') {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem(NOTICE_KEY); // cada participante vuelve a ver el aviso de privacidad
      startParams.delete('reset');
      var q = startParams.toString();
      window.history.replaceState(null, '', window.location.pathname + (q ? '?' + q : '') + window.location.hash);
    }
  } catch (e) { /* sin almacenamiento o sin historial: se ignora */ }
  var state = load();

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function sessionHref(n) { return root + 'sesiones/sesion-' + pad(n) + '.html'; }
  function doneCount() { var c = 0; for (var i = 1; i <= TOTAL; i++) if (state.completed[i]) c++; return c; }
  function nextSession() { for (var i = 1; i <= TOTAL; i++) if (!state.completed[i]) return i; return null; }
  function statusOf(n) {
    if (state.completed[n]) return 'done';
    return nextSession() === n ? 'current' : 'pending';
  }
  var LABEL = { done: 'Completada', current: 'En curso', pending: 'Pendiente' };
  function setPill(el, st) {
    if (!el) return;
    el.className = 'pill pill--' + st;
    el.innerHTML = (st === 'done' ? ICON_CHECK : '') + LABEL[st];
  }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  var timeFmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  /* ---------- Analítica: eventos del plan de medición (Hotjar) ----------
   * Los nombres solo usan letras, números y guion bajo.
   * Si Hotjar no cargó (bloqueador, sin HTTPS), no pasa nada. */
  function track(name) {
    try { if (typeof window.hj === 'function') window.hj('event', name); } catch (e) { /* sin analítica */ }
  }
  function bindTracking() {
    // Todo botón o enlace con id "btn-..." envía "clic_...": btn-continuar-curso -> clic_continuar_curso
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[id^="btn-"]');
      if (el) track('clic_' + el.id.slice(4).replace(/-/g, '_'));
    });
  }

  /* ---------- Menú móvil plegable ----------
   * Sin JavaScript el menú queda siempre visible. Con JavaScript, en pantallas
   * angostas los enlaces se pliegan tras el botón "Menú"; el buscador sigue a la vista. */
  function bindMenu() {
    var nav = document.querySelector('.site-nav');
    var inner = nav && nav.querySelector('.site-nav__inner');
    var links = nav && nav.querySelector('.site-nav__links');
    if (!inner || !links) return;
    if (!links.id) links.id = 'menu-principal';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'site-nav__toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', links.id);
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>Menú';
    inner.insertBefore(btn, inner.firstChild);
    nav.classList.add('site-nav--js');
    function set(open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      set(open);
      track(open ? 'menu_abierto' : 'menu_cerrado');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); btn.focus(); }
    });
  }

  /* ---------- Foco de luz en las tarjetas oscuras ----------
   * Solo decorativo: pasa la posición del cursor al CSS (--mx, --my). */
  function bindSpotlight() {
    var SPOT = '.card--hero, .module-card--active, .course-map__item--active .course-map__card, .session-card--current';
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest(SPOT);
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- Aviso de privacidad y consentimiento ---------- */
  function bindPrivacy() {
    var footer = document.querySelector('.site-footer__inner');
    var banner = document.createElement('section');
    banner.className = 'privacy-banner';
    banner.setAttribute('aria-label', 'Aviso de privacidad');
    banner.innerHTML = '<div class="container privacy-banner__inner">' +
      '<p><strong>Aviso de privacidad.</strong> Este prototipo académico registra cómo navegas (clics, movimiento del cursor, desplazamiento y grabación de la pantalla del sitio) con Hotjar y Maze, para evaluar la experiencia de uso. No pedimos tu nombre ni tu correo. Ocultamos en Hotjar lo que escribes en la bitácora; aun así, no escribas datos personales. Si prefieres no participar, cierra esta pestaña.</p>' +
      '<button type="button" class="btn btn--primary" data-privacy-accept>Entendido</button></div>';
    function seen() { try { return window.localStorage.getItem(NOTICE_KEY) === '1'; } catch (e) { return false; } }
    function show() { if (!banner.parentNode) document.body.appendChild(banner); }
    banner.querySelector('[data-privacy-accept]').addEventListener('click', function () {
      try { window.localStorage.setItem(NOTICE_KEY, '1'); } catch (e) { /* se volverá a mostrar */ }
      banner.remove();
      track('aviso_privacidad_aceptado');
    });
    if (footer) {
      var again = document.createElement('button');
      again.type = 'button';
      again.className = 'link-button';
      again.textContent = 'Ver aviso de privacidad';
      again.addEventListener('click', function () { show(); banner.querySelector('button').focus(); });
      footer.appendChild(again);
    }
    if (!seen()) show();
  }

  /* ---------- Progreso (inicio y módulo) ---------- */
  function renderProgress() {
    var done = doneCount();
    var pct = Math.round((done / TOTAL) * 100);
    document.querySelectorAll('[data-progress]').forEach(function (bar) {
      bar.setAttribute('aria-valuenow', String(done));
      bar.setAttribute('aria-valuetext', done + ' de ' + TOTAL + ' sesiones');
      var fill = bar.querySelector('[data-progress-fill]');
      if (fill) fill.style.setProperty('--progress', pct + '%');
    });
    document.querySelectorAll('[data-progress-percent]').forEach(function (el) { el.textContent = pct + '%'; });
    document.querySelectorAll('[data-progress-text]').forEach(function (el) {
      el.textContent = done + ' de ' + TOTAL + ' sesiones completadas · Demostración local';
    });
    var next = nextSession();
    document.querySelectorAll('[data-continue]').forEach(function (a) {
      a.setAttribute('href', next ? sessionHref(next) : root + 'modulo-evaluacion.html');
      if (!next) a.innerHTML = 'Volver al módulo' + ICON_ARROW;
    });
    var title = document.querySelector('[data-hero-title]');
    var sub = document.querySelector('[data-hero-sub]');
    if (title) title.textContent = done === 0 ? 'Comienza tu recorrido' : (next ? 'Continúa donde lo dejaste' : 'Completaste el módulo');
    if (sub) sub.textContent = next ? 'Sesión ' + pad(next) + ' · Título pendiente de confirmar' : 'Las 10 sesiones están marcadas como completadas.';
    var bp = document.querySelector('[data-bitacora-pill]');
    if (bp) {
      var hasDraft = Object.keys(state.drafts || {}).length > 0;
      bp.className = 'pill ' + (hasDraft ? 'pill--current' : 'pill--pending');
      bp.textContent = hasDraft ? 'Borrador guardado' : 'Pendiente';
    }
  }

  /* ---------- Módulo de evaluación ---------- */
  function renderModule() {
    document.querySelectorAll('[data-session-card]').forEach(function (card) {
      var n = Number(card.getAttribute('data-session-card'));
      var st = statusOf(n);
      card.classList.toggle('session-card--current', st === 'current');
      setPill(card.querySelector('[data-session-pill]'), st);
      var link = card.querySelector('[data-session-link]');
      if (link) {
        link.className = 'btn ' + (st === 'current' ? 'btn--primary' : 'btn--secondary');
        link.innerHTML = (st === 'done' ? 'Ver sesión' : 'Comenzar sesión') + ICON_ARROW;
        link.setAttribute('aria-label', (st === 'done' ? 'Ver sesión ' : 'Comenzar sesión ') + pad(n));
      }
    });
  }

  /* ---------- Sesión ---------- */
  function renderSession() {
    var n = Number(document.body.getAttribute('data-session'));
    setPill(document.querySelector('[data-session-pill]'), statusOf(n));
    document.querySelectorAll('[data-nav-session]').forEach(function (a) {
      var k = Number(a.getAttribute('data-nav-session'));
      var mark = a.querySelector('[data-nav-state]');
      if (mark) mark.innerHTML = state.completed[k] ? ICON_CHECK + '<span class="visually-hidden">Completada</span>' : '';
    });
    var btn = document.querySelector('[data-toggle-complete]');
    if (btn) btn.textContent = state.completed[n] ? 'Marcar como pendiente' : 'Marcar como completada';
  }

  function bindSession() {
    var n = Number(document.body.getAttribute('data-session'));
    var btn = document.querySelector('[data-toggle-complete]');
    var note = document.querySelector('[data-complete-note]');
    if (btn) btn.addEventListener('click', function () {
      if (state.completed[n]) delete state.completed[n]; else state.completed[n] = true;
      var ok = save();
      renderSession();
      if (ok) track(state.completed[n] ? 'sesion_completada' : 'sesion_pendiente');
      if (note) note.textContent = !ok ? 'No pudimos guardar el cambio en este navegador. Inténtalo de nuevo.' :
        (state.completed[n] ? 'Sesión marcada como completada en este navegador.' : 'Sesión marcada como pendiente.');
    });
    var jump = document.querySelector('[data-session-jump]');
    if (jump) jump.addEventListener('change', function () { window.location.href = jump.value; });
  }

  /* ---------- Mapa del curso ---------- */
  function applyView(view) {
    var map = document.querySelector('[data-course-map]');
    if (!map) return;
    map.classList.toggle('course-map--grid', view === 'libre');
    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view));
    });
  }
  function bindMap() {
    applyView(state.profile);
    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        setProfile(b.getAttribute('data-view'));
        track('mapa_vista_' + b.getAttribute('data-view'));
      });
    });
  }

  /* ---------- Perfil de prueba ---------- */
  var profileSelect = document.querySelector('[data-profile]');
  function setProfile(p) {
    state.profile = p;
    save();
    if (profileSelect) profileSelect.value = p;
    applyView(p);
  }
  if (profileSelect) {
    // "Coordinador pedagógico" no es una vista del mapa: lleva a su propia página.
    profileSelect.value = page === 'coordinador' ? 'coordinador' : state.profile;
    profileSelect.addEventListener('change', function () {
      if (profileSelect.value === 'coordinador') {
        track('perfil_coordinador');
        window.location.href = root + 'coordinador.html';
        return;
      }
      setProfile(profileSelect.value);
      if (page === 'coordinador') window.location.href = root + 'index.html';
    });
  }

  /* ---------- Bitácora ---------- */
  function bindBitacora() {
    var form = document.querySelector('[data-bitacora-form]');
    if (!form) return;
    var select = form.querySelector('[data-bitacora-session]');
    var fields = form.querySelectorAll('[data-field]');
    var savedAt = form.querySelector('[data-saved-at]');
    var ok = form.querySelector('[data-msg-ok]');
    var err = form.querySelector('[data-msg-error]');
    var errText = form.querySelector('[data-msg-error-text]');
    var dirty = false;

    // "Examinar archivo": demostración local, solo se guarda el nombre y el tamaño.
    var fileInput = form.querySelector('[data-file-input]');
    var fileBtn = form.querySelector('[data-file-button]');
    var fileName = form.querySelector('[data-file-name]');
    var fileRemove = form.querySelector('[data-file-remove]');
    var archivo = null;
    function showFile() {
      if (!fileName) return;
      fileName.textContent = archivo ? archivo.name + ' (' + Math.max(1, Math.round(archivo.size / 1024)) + ' KB)' : 'Ningún archivo seleccionado';
      fileRemove.hidden = !archivo;
    }
    if (fileInput) {
      fileBtn.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) return;
        archivo = { name: f.name, size: f.size };
        dirty = true; ok.hidden = true;
        showFile();
        track('archivo_adjuntado');
      });
      fileRemove.addEventListener('click', function () {
        archivo = null; fileInput.value = ''; dirty = true;
        showFile();
        fileBtn.focus();
        track('archivo_quitado');
      });
    }

    var params = new URLSearchParams(window.location.search);
    var fromUrl = Number(params.get('sesion'));
    if (fromUrl >= 1 && fromUrl <= TOTAL) select.value = String(fromUrl);

    function fill() {
      var d = state.drafts[select.value] || {};
      fields.forEach(function (f) { f.value = d[f.getAttribute('data-field')] || ''; });
      savedAt.textContent = d.savedAt ? 'Último guardado: ' + timeFmt.format(new Date(d.savedAt)) : '';
      archivo = d.archivo || null;
      if (fileInput) fileInput.value = '';
      showFile();
      ok.hidden = true; err.hidden = true; dirty = false;
    }
    function renderDrafts() {
      var list = document.querySelector('[data-drafts]');
      var empty = document.querySelector('[data-drafts-empty]');
      var keys = Object.keys(state.drafts).map(Number).sort(function (a, b) { return a - b; });
      list.innerHTML = keys.map(function (k) {
        var d = state.drafts[k];
        return '<li><span><strong>Sesión ' + pad(k) + '</strong><br><span class="small text-secondary">Guardado el ' + esc(timeFmt.format(new Date(d.savedAt))) + '</span></span>' +
          '<button type="button" class="link-button" data-open-draft="' + k + '">Abrir<span class="visually-hidden"> el borrador de la sesión ' + pad(k) + '</span></button></li>';
      }).join('');
      empty.hidden = keys.length > 0;
    }

    fields.forEach(function (f) {
      f.addEventListener('input', function () { dirty = true; ok.hidden = true; });
    });
    select.addEventListener('change', fill);
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open-draft]');
      if (!b) return;
      select.value = b.getAttribute('data-open-draft');
      fill();
      select.focus();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {};
      var any = false;
      fields.forEach(function (f) { data[f.getAttribute('data-field')] = f.value; if (f.value.trim()) any = true; });
      if (archivo) { data.archivo = archivo; any = true; }
      ok.hidden = true; err.hidden = true;
      if (!any) {
        errText.textContent = 'Escribe algo en al menos un campo antes de guardar.';
        err.hidden = false;
        track('bitacora_error_vacia');
        fields[0].focus();
        return;
      }
      data.savedAt = Date.now();
      var previous = state.drafts[select.value];
      state.drafts[select.value] = data;
      if (save()) {
        dirty = false;
        // Destino verificable para las pruebas: página de confirmación con URL propia.
        window.location.href = root + 'bitacora-guardada.html?sesion=' + encodeURIComponent(select.value);
      } else {
        if (previous) state.drafts[select.value] = previous; else delete state.drafts[select.value];
        errText.textContent = 'No pudimos guardar tu borrador. Inténtalo de nuevo.';
        err.hidden = false;
      }
    });
    window.addEventListener('beforeunload', function (e) {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    });
    fill();
    renderDrafts();
  }

  /* ---------- Confirmación de la bitácora ---------- */
  function renderSaved() {
    var n = new URLSearchParams(window.location.search).get('sesion');
    var d = n && state.drafts[n];
    var title = document.querySelector('[data-saved-title]');
    var sub = document.querySelector('[data-saved-sub]');
    var box = document.querySelector('[data-saved-summary]');
    var keep = document.querySelector('[data-keep-writing]');
    if (keep && n) keep.setAttribute('href', root + 'bitacora.html?sesion=' + encodeURIComponent(n));
    if (!d) {
      if (title) title.textContent = 'No encontramos tu borrador';
      if (sub) sub.textContent = 'Vuelve a Mi bitácora para escribir y guardar.';
      return;
    }
    track('bitacora_guardada');
    if (sub) sub.textContent = 'Sesión ' + pad(Number(n)) + ' · Guardado el ' + timeFmt.format(new Date(d.savedAt));
    var labels = [['aprendizaje', 'Lo que aprendí'], ['aplicacion', 'Cómo lo aplico'], ['duda', 'Duda o hallazgo']];
    var empty = box.querySelector('[data-saved-empty]');
    if (empty) empty.remove();
    labels.forEach(function (l) {
      var h = document.createElement('h3');
      h.className = 'saved-label';
      h.textContent = l[1];
      var p = document.createElement('p');
      p.className = d[l[0]] ? 'prewrap' : 'text-secondary';
      p.textContent = d[l[0]] || 'Sin texto.';
      box.appendChild(h);
      box.appendChild(p);
    });
    if (d.archivo) {
      var fh = document.createElement('h3');
      fh.className = 'saved-label';
      fh.textContent = 'Evidencia';
      var fp = document.createElement('p');
      fp.className = 'prewrap';
      fp.textContent = d.archivo.name + ' · solo se guardó el nombre del archivo (demostración local)';
      box.appendChild(fh);
      box.appendChild(fp);
    }
  }

  /* ---------- Buscador ---------- */
  var INDEX = [
    { t: 'Inicio', d: 'Tu espacio de aprendizaje', h: 'index.html' },
    { t: 'Mapa del curso', d: 'Módulos e hitos del diplomado', h: 'mapa-curso.html' },
    { t: 'Módulo de evaluación', d: '10 sesiones', h: 'modulo-evaluacion.html', k: 'evaluacion sesiones' },
    { t: 'Mi bitácora', d: 'Lo que aprendí, cómo lo aplico y mis dudas', h: 'bitacora.html', k: 'reflexion borrador' },
    { t: 'Nodo IA', d: 'Casos y experiencias sobre IA en el aula', h: 'nodo-ia.html', k: 'repositorio casos etica debate comentarios compartir' },
    { t: 'Módulo 01', d: 'Posicionamiento crítico frente a la IA en educación', h: 'mapa-curso.html' },
    { t: 'Módulo 02', d: 'Mediación pedagógica y didáctica con IA', h: 'mapa-curso.html' },
    { t: 'Módulo 03', d: 'Diseño curricular, evaluación y gestión académica con IA', h: 'modulo-evaluacion.html' },
    { t: 'Módulo 04', d: 'Ética, soberanía tecnológica y bienestar docente', h: 'mapa-curso.html' },
    { t: 'Módulo 05', d: 'Proyecto aplicado: diseño e implementación', h: 'mapa-curso.html' },
    { t: 'Hitos del proyecto final', d: 'Semanas 4, 7, 10, 12 y 14', h: 'mapa-curso.html', k: 'hito modalidad diagnostico marco etico propuesta entrega presentacion' }
  ];
  for (var s = 1; s <= TOTAL; s++) INDEX.push({ t: 'Sesión ' + pad(s), d: 'Módulo de evaluación', h: 'sesiones/sesion-' + pad(s) + '.html', k: 'sesion ' + s });

  function bindSearch() {
    var form = document.querySelector('[data-search]');
    if (!form) return;
    var input = form.querySelector('input');
    var box = form.querySelector('[data-search-results]');
    function close() { box.hidden = true; box.innerHTML = ''; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q) { input.focus(); return; }
      var nq = norm(q);
      var hits = INDEX.filter(function (it) { return norm(it.t + ' ' + it.d + ' ' + (it.k || '')).indexOf(nq) !== -1; });
      track(hits.length ? 'busqueda_con_resultados' : 'busqueda_sin_resultados');
      if (!hits.length) {
        box.innerHTML = '<p>No encontramos resultados para «' + esc(q) + '». Prueba con otra palabra o explora el <a href="' + root + 'mapa-curso.html">Mapa del curso</a>.</p>';
      } else {
        box.innerHTML = '<p class="small text-secondary">' + hits.length + (hits.length === 1 ? ' resultado' : ' resultados') + '</p><ul>' +
          hits.slice(0, 8).map(function (it) {
            return '<li><a href="' + root + it.h + '"><strong>' + esc(it.t) + '</strong><span class="small text-secondary">' + esc(it.d) + '</span></a></li>';
          }).join('') + '</ul>';
      }
      box.hidden = false;
      var first = box.querySelector('a');
      if (first) first.focus();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) { close(); input.focus(); } });
    document.addEventListener('click', function (e) { if (!box.hidden && !form.contains(e.target)) close(); });
  }

  /* ---------- Puente para js/extras.js (tutor, glosario, Nodo IA, coordinador) ---------- */
  window.SPIA = { state: state, save: save, track: track, root: root, page: page, esc: esc, pad: pad, timeFmt: timeFmt };

  /* ---------- Arranque ---------- */
  renderProgress();
  bindSearch();
  bindTracking();
  bindMenu();
  bindSpotlight();
  bindPrivacy();
  if (page === 'modulo') renderModule();
  if (page === 'sesion') { renderSession(); bindSession(); }
  if (page === 'mapa') bindMap();
  if (page === 'bitacora') bindBitacora();
  if (page === 'bitacora-guardada') renderSaved();
  if (page === '404') track('pagina_no_encontrada');
})();
