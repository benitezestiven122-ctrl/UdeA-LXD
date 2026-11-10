/* extras.js — Ser profe en la era de la IA
 * Panel de tutor (HU-08), glosario flotante (HU-09), Nodo IA (HU-01)
 * y vista de coordinador (HU-15). Sin librerías.
 * Usa window.SPIA (js/main.js) y window.SPIA_DEMO (js/datos-demo.js).
 * Todo lo que se publica o escribe aquí es una demostración local.
 */
(function () {
  'use strict';

  var S = window.SPIA;
  var D = window.SPIA_DEMO;
  if (!S || !D) return;
  var state = S.state;
  var esc = S.esc;
  var track = S.track;
  var root = S.root;

  if (!state.nodo) state.nodo = { propias: [], comentarios: {}, reconocimientos: {} };

  var ICON_CLOSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>';
  var ICON_CHAT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path></svg>';
  var ICON_ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"></path></svg>';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- Panel lateral (drawer) reutilizable ---------- */
  var current = null;
  function openDrawer(opts) {
    if (current) current.close();
    var last = document.activeElement;
    var backdrop = el('div', 'drawer-backdrop');
    var panel = el('aside', 'drawer');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'drawer-title');
    var head = el('header', 'drawer__head',
      '<div><p class="eyebrow">' + esc(opts.kicker || '') + '</p><h2 class="h4" id="drawer-title">' + esc(opts.title) + '</h2></div>');
    var closeBtn = el('button', 'drawer__close', ICON_CLOSE + '<span class="visually-hidden">Cerrar panel</span>');
    closeBtn.type = 'button';
    head.appendChild(closeBtn);
    var body = el('div', 'drawer__body');
    body.appendChild(opts.body);
    panel.appendChild(head);
    panel.appendChild(body);
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    // Fuerza un reflujo para que la transición de entrada corra.
    void panel.offsetWidth;
    backdrop.classList.add('is-open');
    panel.classList.add('is-open');

    function onKey(e) {
      if (e.key === 'Escape') { api.close(); return; }
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,[tabindex="0"]');
      var list = Array.prototype.filter.call(f, function (x) { return x.offsetParent !== null; });
      if (!list.length) return;
      var first = list[0], lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
    var api = {
      close: function () {
        document.removeEventListener('keydown', onKey);
        backdrop.remove();
        panel.remove();
        current = null;
        if (last && last.focus) last.focus();
      }
    };
    closeBtn.addEventListener('click', api.close);
    backdrop.addEventListener('click', api.close);
    document.addEventListener('keydown', onKey);
    current = api;
    closeBtn.focus();
    return api;
  }

  /* ---------- Panel de tutor (HU-08) ---------- */
  function tutorBody() {
    var wrap = el('div', 'tutor');
    wrap.appendChild(el('div', 'tutor__brand',
      '<img src="' + root + 'assets/imagenes/logo-udea.webp" width="37" height="48" alt="">' +
      '<p><strong>Facultad de Educación · Universidad de Antioquia</strong><br><span class="small text-secondary">Te acompañamos en este recorrido.</span></p>'));

    var team = el('ul', 'avatars');
    D.tutores.forEach(function (t) {
      team.appendChild(el('li', 'avatars__item',
        '<span class="avatar" aria-hidden="true">' + esc(t.ini) + '</span>' +
        '<span><strong>' + esc(t.rol) + '</strong><br><span class="small text-secondary">' + esc(t.nota) + '</span></span>'));
    });
    wrap.appendChild(team);
    wrap.appendChild(el('p', 'small text-secondary', 'Nombres y fotos del equipo: Disponible próximamente.'));

    // Pestañas: Mensajes / Glosario
    var tabs = el('div', 'tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Secciones del panel');
    var tabA = el('button', 'tab', 'Mensajes');
    var tabB = el('button', 'tab', 'Glosario');
    [tabA, tabB].forEach(function (t, i) {
      t.type = 'button';
      t.setAttribute('role', 'tab');
      t.id = 'tab-tutor-' + i;
      t.setAttribute('aria-controls', 'panel-tutor-' + i);
    });
    tabs.appendChild(tabA); tabs.appendChild(tabB);
    wrap.appendChild(tabs);

    // Mensajes
    var pA = el('div', 'tabpanel');
    pA.id = 'panel-tutor-0'; pA.setAttribute('role', 'tabpanel'); pA.setAttribute('aria-labelledby', 'tab-tutor-0');
    var log = el('div', 'chat');
    log.setAttribute('aria-live', 'polite');
    log.setAttribute('data-hj-suppress', '');
    function say(who, text) {
      var b = el('p', 'bubble bubble--' + who);
      b.textContent = text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
    }
    say('them', D.bienvenida);
    pA.appendChild(log);
    var chips = el('div', 'chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Preguntas frecuentes');
    D.respuestas.forEach(function (r) {
      var c = el('button', 'chip');
      c.type = 'button';
      c.textContent = r.q;
      c.addEventListener('click', function () {
        say('me', r.q);
        window.setTimeout(function () { say('them', r.a); }, 350);
        track('tutor_pregunta_frecuente');
      });
      chips.appendChild(c);
    });
    pA.appendChild(chips);
    var form = el('form', 'tutor__form',
      '<label for="tutor-msg">Escríbenos</label>' +
      '<textarea id="tutor-msg" rows="3" data-hj-suppress></textarea>' +
      '<button type="submit" class="btn btn--primary" id="btn-enviar-mensaje-tutor">Enviar mensaje</button>' +
      '<p class="small text-secondary"><strong>Demostración local.</strong> El mensaje no se envía ni se guarda.</p>');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ta = form.querySelector('textarea');
      var v = ta.value.trim();
      if (!v) { ta.focus(); return; }
      say('me', v);
      ta.value = '';
      window.setTimeout(function () { say('them', D.respuestaLibre); }, 350);
      track('tutor_mensaje_enviado');
    });
    pA.appendChild(form);
    wrap.appendChild(pA);

    // Glosario
    var pB = el('div', 'tabpanel');
    pB.id = 'panel-tutor-1'; pB.setAttribute('role', 'tabpanel'); pB.setAttribute('aria-labelledby', 'tab-tutor-1');
    var dl = el('dl', 'glossary-list');
    D.glosario.forEach(function (g) {
      var dt = el('dt'); dt.textContent = g.t.charAt(0).toUpperCase() + g.t.slice(1);
      var dd = el('dd'); dd.textContent = g.d;
      dl.appendChild(dt); dl.appendChild(dd);
    });
    pB.appendChild(dl);
    pB.appendChild(el('p', 'small text-secondary', 'Definiciones propuestas, por aprobar.'));
    wrap.appendChild(pB);

    function select(i) {
      [tabA, tabB].forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      pA.hidden = i !== 0; pB.hidden = i !== 1;
    }
    tabA.addEventListener('click', function () { select(0); });
    tabB.addEventListener('click', function () { select(1); track('tutor_glosario'); });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabA.getAttribute('aria-selected') === 'true' ? 1 : 0;
      select(next);
      (next ? tabB : tabA).focus();
    });
    select(0);
    return wrap;
  }
  function bindTutor() {
    var fab = el('button', 'tutor-fab', ICON_CHAT + '<span>Contactar tutor</span>');
    fab.type = 'button';
    fab.id = 'btn-contactar-tutor';
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.addEventListener('click', function () {
      openDrawer({ kicker: 'Acompañamiento', title: 'Equipo tutor', body: tutorBody() });
    });
    document.body.appendChild(fab);
  }

  /* ---------- Glosario flotante (HU-09) ---------- */
  var tip = null, tipFor = null;
  function hideTip() {
    if (!tip) return;
    tip.hidden = true;
    if (tipFor) tipFor.setAttribute('aria-expanded', 'false');
    tipFor = null;
  }
  function showTip(btn) {
    var g = D.glosario[Number(btn.getAttribute('data-term'))];
    if (!g) return;
    if (!tip) {
      tip = el('div', 'glossary-tip');
      tip.id = 'glosario-tip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    tip.innerHTML = '<strong>' + esc(g.t) + '</strong><span>' + esc(g.d) + '</span>';
    tip.hidden = false;
    var r = btn.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    var top = r.top - h - 10;
    var below = top < 80;
    if (below) top = r.bottom + 10;
    tip.classList.toggle('glossary-tip--below', below);
    tip.style.setProperty('--tip-left', (left + window.scrollX) + 'px');
    tip.style.setProperty('--tip-top', (top + window.scrollY) + 'px');
    if (tipFor !== btn) track('glosario_consultado');
    tipFor = btn;
    btn.setAttribute('aria-expanded', 'true');
  }
  function bindGlossary(scope) {
    var containers = (scope || document).querySelectorAll('[data-glossary]');
    if (!containers.length) return;
    var terms = D.glosario.map(function (g, i) { return { t: g.t, i: i }; })
      .sort(function (a, b) { return b.t.length - a.t.length; });
    var re = new RegExp('(' + terms.map(function (x) { return x.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'i');
    Array.prototype.forEach.call(containers, function (c) {
      if (c.hasAttribute('data-glossary-done')) return;
      c.setAttribute('data-glossary-done', '');
      var used = {};
      var walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT, null);
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (node) {
        if (!node.parentElement || node.parentElement.closest('a,button,textarea,select,script,.term')) return;
        var m = re.exec(node.nodeValue);
        if (!m) return;
        var idx = -1;
        terms.forEach(function (x) { if (x.t.toLowerCase() === m[1].toLowerCase()) idx = x.i; });
        if (idx < 0 || used[idx]) return;
        used[idx] = true;
        var after = node.splitText(m.index);
        after.nodeValue = after.nodeValue.slice(m[1].length);
        var b = el('button', 'term');
        b.type = 'button';
        b.textContent = m[1];
        b.setAttribute('data-term', String(idx));
        b.setAttribute('aria-describedby', 'glosario-tip');
        b.setAttribute('aria-expanded', 'false');
        node.parentNode.insertBefore(b, after);
      });
    });
  }
  function bindGlossaryEvents() {
    document.addEventListener('mouseover', function (e) {
      var b = e.target.closest && e.target.closest('.term');
      if (b) showTip(b);
    });
    document.addEventListener('mouseout', function (e) {
      var b = e.target.closest && e.target.closest('.term');
      if (b && document.activeElement !== b) hideTip();
    });
    document.addEventListener('focusin', function (e) {
      if (e.target.classList && e.target.classList.contains('term')) showTip(e.target);
    });
    document.addEventListener('focusout', function (e) {
      if (e.target.classList && e.target.classList.contains('term')) hideTip();
    });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.term');
      if (b) { if (tipFor === b && !tip.hidden) hideTip(); else showTip(b); }
      else hideTip();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });
    window.addEventListener('scroll', hideTip, { passive: true });
  }

  /* ---------- Nodo IA (HU-01) ---------- */
  /* ---------- Nodo IA: red 3D, lector deslizable y nodos nuevos ---------- */
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TIPOS = { proyecto: 'Proyecto', paper: 'Paper', bitacora: 'Bitácora' };
  var ICON_BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6"></path></svg>';
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

  function norm(o, tipo) {
    var n = {};
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) n[k] = o[k];
    n.tipo = o.tipo || tipo;
    n.texto = o.texto || [];
    n.rel = o.rel || [];
    n.comentarios = o.comentarios || [];
    return n;
  }
  function nodos() {
    var list = [];
    D.casos.forEach(function (c) { list.push(norm(c, 'proyecto')); });
    (D.papers || []).forEach(function (p) { list.push(norm(p, 'paper')); });
    (D.bitacorasEjemplo || []).forEach(function (b) { list.push(norm(b, 'bitacora')); });
    (state.nodo.propias || []).forEach(function (p) { list.push(norm(p, 'proyecto')); });
    return list;
  }
  function allCases() { return nodos(); }
  function commentsOf(c) {
    return (c.comentarios || []).concat(state.nodo.comentarios[c.id] || []);
  }

  // Ilustraciones de ejemplo (SVG generado con los colores del sitio).
  function illus(kind) {
    var bg = cssVar('--color-primary-dark'), a = cssVar('--color-primary-deep'), b = cssVar('--color-primary-light'), c = cssVar('--color-cta'), w = cssVar('--color-bg');
    var body = '';
    if (kind === 'rubrica') {
      for (var r = 0; r < 4; r++) for (var q = 0; q < 4; q++) {
        body += '<rect x="' + (60 + q * 122) + '" y="' + (70 + r * 64) + '" width="110" height="52" rx="8" fill="' + (r === 0 ? b : (q === (r + 1) % 4 ? c : (q % 2 ? a : w))) + '"/>';
      }
    } else if (kind === 'barras') {
      [120, 200, 90, 240, 170].forEach(function (h, i) { body += '<rect x="' + (90 + i * 90) + '" y="' + (320 - h) + '" width="56" height="' + h + '" rx="6" fill="' + (i === 3 ? c : b) + '"/>'; });
      body += '<rect x="60" y="322" width="480" height="4" fill="' + w + '"/>';
    } else {
      [[150, 180, 62, b], [300, 130, 80, c], [450, 200, 56, b], [230, 280, 44, w], [390, 290, 50, c]].forEach(function (p) {
        body += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + p[2] + '" fill="' + p[3] + '" opacity=".88"/>';
      });
      body += '<path d="M150 180 300 130 450 200 390 290 230 280z" fill="none" stroke="' + w + '" stroke-width="3" opacity=".6"/>';
    }
    return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380"><rect width="600" height="380" fill="' + bg + '"/>' + body + '</svg>');
  }
  var WAVE = '';
  for (var wv = 0; wv < 28; wv++) WAVE += '<span style-h="' + (20 + Math.round(Math.abs(Math.sin(wv * 1.7)) * 70)) + '"></span>';
  function mediaHTML(media) {
    if (!media || !media.length) return '';
    return '<div class="media-grid">' + media.map(function (m) {
      var cap = '<figcaption>' + esc(m.pie || m.nombre || '') + (m.ejemplo ? ' · Ejemplo' : '') + '</figcaption>';
      if (m.tipo === 'imagen') return '<figure class="media-item"><img src="' + esc(m.src || illus(m.ilus)) + '" alt="' + esc(m.alt || m.pie || m.nombre || 'Imagen') + '" loading="lazy">' + cap + '</figure>';
      if (m.tipo === 'video') return '<figure class="media-item"><div class="media-mock" role="img" aria-label="Video' + (m.ejemplo ? ' de ejemplo, no reproducible' : ' adjunto; en esta demostración solo se guarda el nombre') + '"><span class="media-play"></span><span class="media-dur">' + esc(m.duracion || 'Video') + '</span></div>' + cap + '</figure>';
      return '<figure class="media-item"><div class="media-mock media-mock--audio" role="img" aria-label="Nota de voz' + (m.ejemplo ? ' de ejemplo, no reproducible' : ' adjunta; en esta demostración solo se guarda el nombre') + '"><span class="media-wave">' + WAVE + '</span><span class="media-dur">' + esc(m.duracion || 'Audio') + '</span></div>' + cap + '</figure>';
    }).join('') + '</div>';
  }
  /* Multimedia embebida de ejemplo: visor de documento para papers y
     reproductor de video para proyectos. Si un nodo trae `embed` con una URL
     https real (YouTube no listado, Drive, PDF), se usa un <iframe>. */
  function xmlEsc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); }
  function wrapWords(text, max) {
    var lines = [], cur = '';
    String(text).split(' ').forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w;
    });
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }
  function pdfPage(n, page) {
    var ink = cssVar('--color-text'), soft = cssVar('--color-border'), acc = cssVar('--color-primary-deep'), cta = cssVar('--color-cta'), paper = cssVar('--color-bg');
    var s = '<rect width="420" height="560" fill="' + paper + '"/><rect x="0" y="0" width="420" height="10" fill="' + acc + '"/>';
    var y = 60;
    if (page === 1) {
      wrapWords(n.titulo, 34).slice(0, 4).forEach(function (l) { s += '<text x="40" y="' + y + '" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="' + ink + '">' + xmlEsc(l) + '</text>'; y += 24; });
      s += '<text x="40" y="' + (y + 6) + '" font-family="Arial,sans-serif" font-size="11" fill="' + acc + '">' + xmlEsc((n.autores || '') + ' · ' + (n.anio || '')) + '</text>';
      y += 34;
      s += '<text x="40" y="' + y + '" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="' + ink + '">RESUMEN</text>';
      y += 18;
    } else {
      s += '<text x="40" y="44" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="2" fill="' + acc + '">' + (page === 2 ? 'INTRODUCCIÓN' : (page === 3 ? 'RESULTADOS' : 'DISCUSIÓN')) + '</text>';
      y = 66;
    }
    for (var i = 0; y < 520; i++) {
      if (page === 3 && i === 6) {
        [60, 110, 80, 140, 95].forEach(function (h, k) { s += '<rect x="' + (60 + k * 62) + '" y="' + (y + 150 - h) + '" width="40" height="' + h + '" rx="4" fill="' + (k === 3 ? cta : acc) + '" opacity=".85"/>'; });
        s += '<rect x="40" y="' + (y + 152) + '" width="340" height="2" fill="' + soft + '"/>';
        y += 176; continue;
      }
      var w = i % 7 === 6 ? 180 : 340 - (i * 37 % 60);
      s += '<rect x="40" y="' + y + '" width="' + w + '" height="7" rx="3" fill="' + soft + '"/>';
      y += i % 7 === 6 ? 24 : 15;
    }
    s += '<text x="210" y="545" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="' + acc + '">' + page + '</text>';
    return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560">' + s + '</svg>');
  }
  var PDF_PAGES = 4;
  function embedsHTML(n) {
    if (n.embed && /^https:\/\//i.test(n.embed)) {
      return '<figure class="embed"><div class="embed__frame"><iframe src="' + esc(n.embed) + '" title="' + esc(n.titulo) + '" loading="lazy" allowfullscreen></iframe></div></figure>';
    }
    if (n.propia) return '';
    if (n.tipo === 'paper') {
      var pages = '';
      for (var p = 1; p <= PDF_PAGES; p++) pages += '<img class="pdf__page" src="' + pdfPage(n, p) + '" alt="Página ' + p + ' del documento (vista de ejemplo)"' + (p > 1 ? ' hidden' : '') + '>';
      return '<figure class="embed embed--pdf" data-pdf>' +
        '<div class="pdf__bar"><span class="pdf__icon" aria-hidden="true">PDF</span><span class="pdf__name">' + esc(n.titulo) + '</span>' +
        '<span class="pdf__nav"><button type="button" class="pdf__btn" data-pdf-step="-1" aria-label="Página anterior">‹</button><span data-pdf-num aria-live="polite">1 / ' + PDF_PAGES + '</span><button type="button" class="pdf__btn" data-pdf-step="1" aria-label="Página siguiente">›</button></span></div>' +
        '<div class="pdf__viewport">' + pages + '</div>' +
        '<figcaption>Vista de ejemplo del documento embebido. Aquí va el PDF real (enlace público o Drive con «Cualquier persona con el enlace»).</figcaption></figure>';
    }
    if (n.tipo === 'proyecto') {
      var kind = { Humanidades: 'rubrica', Ciencias: 'barras' }[n.disciplina] || 'aula';
      var chapters = ['Presentación del reto', 'Trabajo en equipos', 'Cierre y acuerdos'];
      return '<figure class="embed embed--video" data-video>' +
        '<div class="video">' +
        '<img class="video__poster" src="' + illus(kind) + '" alt="">' +
        '<span class="video__badge">Video del aula · 3:12</span>' +
        '<button type="button" class="video__play" data-video-play aria-label="Reproducir el video de ejemplo"><span aria-hidden="true"></span></button>' +
        '<p class="video__note" data-video-note hidden>Vista de ejemplo: aquí se reproduce el video real (YouTube no listado o archivo .mp4).</p>' +
        '<div class="video__controls"><button type="button" class="video__ctl" data-video-play aria-label="Reproducir o pausar">▶</button>' +
        '<span class="video__time" data-video-time>0:00 / 3:12</span><span class="video__bar"><span class="video__fill" data-video-fill></span></span></div>' +
        '</div>' +
        '<ol class="video__chapters">' + chapters.map(function (c, i) { return '<li><span>' + ['0:00', '1:05', '2:20'][i] + '</span>' + esc(c) + '</li>'; }).join('') + '</ol>' +
        '<figcaption>Ejemplo de video embebido en un proyecto.</figcaption></figure>';
    }
    return '';
  }
  // Controles de los embeds (sirven en el lector, en el panel lateral y en la página del caso).
  document.addEventListener('click', function (e) {
    var st = e.target.closest('[data-pdf-step]');
    if (st) {
      var box = st.closest('[data-pdf]'), imgs = box.querySelectorAll('.pdf__page'), cur = 0;
      Array.prototype.forEach.call(imgs, function (im, i) { if (!im.hidden) cur = i; });
      var nx = Math.max(0, Math.min(imgs.length - 1, cur + Number(st.getAttribute('data-pdf-step'))));
      Array.prototype.forEach.call(imgs, function (im, i) { im.hidden = i !== nx; });
      box.querySelector('[data-pdf-num]').textContent = (nx + 1) + ' / ' + imgs.length;
      track('embed_pdf_pagina');
      return;
    }
    var pl = e.target.closest('[data-video-play]');
    if (pl) {
      var v = pl.closest('[data-video]');
      var on = !v.classList.contains('is-playing');
      v.classList.toggle('is-playing', on);
      v.querySelector('[data-video-note]').hidden = !on;
      v.querySelector('.video__ctl').textContent = on ? '❚❚' : '▶';
      if (on && !v._timer) {
        var sec = v._sec || 0;
        v._timer = window.setInterval(function () {
          sec = (sec + 1) % 193; v._sec = sec;
          v.querySelector('[data-video-time]').textContent = Math.floor(sec / 60) + ':' + S.pad(sec % 60) + ' / 3:12';
          v.querySelector('[data-video-fill]').style.setProperty('--p', (sec / 192 * 100) + '%');
        }, 1000);
      } else if (!on) { window.clearInterval(v._timer); v._timer = null; }
      track('embed_video_play');
    }
  });

  function bindWaves(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('[style-h]'), function (s) {
      s.style.setProperty('--h', s.getAttribute('style-h') + '%');
      s.removeAttribute('style-h');
    });
  }

  function nodeHTML(n) {
    var meta = n.tipo === 'paper'
      ? '<p class="node-meta">' + esc(n.autores) + ' (' + esc(n.anio) + ') · <em>' + esc(n.fuente) + '</em></p>'
      : (n.autor ? '<p class="node-meta">' + esc(n.autor) + (n.sesion ? ' · ' + esc(n.sesion) : '') + '</p>' : '');
    var nota = n.propia ? 'Tu aporte · Demostración local' :
      (n.tipo === 'paper' ? 'Referencia real · resumen de demostración redactado con IA. Verifica la fuente antes de citarla.' :
        (n.tipo === 'bitacora' ? 'Bitácora de ejemplo · Demostración' : 'Caso de demostración'));
    return '<div class="row"><span class="pill node-pill node-pill--' + n.tipo + '">' + TIPOS[n.tipo] + '</span>' +
      '<span class="pill pill--light-border">' + esc(n.disciplina) + '</span><span class="pill pill--pending">' + esc(n.tema) + '</span></div>' +
      '<h2 class="node-title">' + esc(n.titulo) + '</h2>' + meta +
      '<p class="lead">' + esc(n.resumen) + '</p>' +
      '<div class="node-text" data-glossary>' +
      n.texto.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      (n.partes ? n.partes.map(function (p) { return '<h3 class="saved-label">' + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p>'; }).join('') : '') +
      (n.hallazgos ? '<h3 class="saved-label">Ideas clave</h3><ul class="plain-list">' + n.hallazgos.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
      '</div>' +
      mediaHTML(n.media) + embedsHTML(n) +
      (n.enlace ? '<p><a class="link-button" href="' + esc(n.enlace) + '" target="_blank" rel="noopener">Abrir el enlace del aporte</a></p>' : '') +
      (n.pregunta ? '<div class="panel panel--soft"><p class="eyebrow">Pregunta para conversar</p><p>' + esc(n.pregunta) + '</p></div>' : '') +
      '<p class="small text-secondary">' + esc(nota) + '</p>';
  }

  /* Lector deslizable: scroll o swipe; flechas en el teclado. */
  var feed = null;
  function openFeed(list, start) {
    if (feed) feed.close();
    var last = document.activeElement;
    var wrap = el('div', 'feed');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'Contenidos de Nodo IA');
    var bar = el('div', 'feed__bar',
      '<button type="button" class="btn btn--secondary" id="btn-volver-red" data-back>' + ICON_BACK + 'Volver a la red</button>' +
      '<p class="feed__count" aria-live="polite"></p>' +
      '<div class="feed__nav"><button type="button" class="feed__arrow" data-step="-1" aria-label="Contenido anterior">↑</button><button type="button" class="feed__arrow" data-step="1" aria-label="Contenido siguiente">↓</button></div>');
    var lane = el('div', 'feed__lane');
    list.forEach(function (n, i) {
      var s = el('article', 'feed__slide');
      s.tabIndex = -1;
      s.setAttribute('aria-label', (i + 1) + ' de ' + list.length + ': ' + n.titulo);
      s.innerHTML = '<div class="feed__card">' + nodeHTML(n) +
        '<div class="feed__actions">' +
        '<button type="button" class="btn btn--primary" id="btn-crear-nodo-' + i + '" data-crear>Crea tu propio nodo' + ICON_ARROW + '</button>' +
        '<a class="btn btn--secondary" href="' + root + 'nodo-ia-caso.html?caso=' + encodeURIComponent(n.id) + '">Comentar y reconocer</a>' +
        '<button type="button" class="link-button" data-back>Volver a la red</button>' +
        '</div>' + (i < list.length - 1 ? '<p class="feed__next small">Siguiente: ' + esc(list[i + 1].titulo) + ' ↓</p>' : '<p class="feed__next small">Llegaste al último nodo.</p>') +
        '</div>';
      lane.appendChild(s);
    });
    wrap.appendChild(bar);
    wrap.appendChild(lane);
    document.body.appendChild(wrap);
    document.body.classList.add('has-feed');
    bindGlossary(wrap);
    bindWaves(wrap);
    var count = bar.querySelector('.feed__count');
    var cur = -1;
    function mark(i) {
      if (i === cur) return;
      if (cur >= 0) track('nodo_siguiente');
      cur = i;
      count.textContent = (i + 1) + ' de ' + list.length + ' · ' + TIPOS[list[i].tipo];
    }
    function go(i, smooth) {
      i = Math.max(0, Math.min(list.length - 1, i));
      var s = lane.children[i];
      lane.scrollTo({ top: s.offsetTop - lane.offsetTop, behavior: smooth && !REDUCE ? 'smooth' : 'auto' });
      s.focus({ preventScroll: true });
      mark(i);
    }
    lane.addEventListener('scroll', function () {
      var mid = lane.scrollTop + lane.clientHeight / 3, idx = 0;
      Array.prototype.forEach.call(lane.children, function (s, k) { if (s.offsetTop - lane.offsetTop <= mid) idx = k; });
      mark(idx);
    }, { passive: true });
    function onKey(e) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1, true); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1, true); }
      else if (e.key === 'Escape') api.close();
    }
    var api = {
      close: function () {
        document.removeEventListener('keydown', onKey);
        wrap.remove();
        document.body.classList.remove('has-feed');
        feed = null;
        if (last && last.focus) last.focus();
      }
    };
    wrap.addEventListener('click', function (e) {
      var st = e.target.closest('[data-step]');
      if (st) { go(cur + Number(st.getAttribute('data-step')), true); return; }
      if (e.target.closest('[data-back]')) { api.close(); return; }
      if (e.target.closest('[data-crear]')) { api.close(); openAddNode(); }
    });
    document.addEventListener('keydown', onKey);
    feed = api;
    track('nodo_abierto');
    window.requestAnimationFrame(function () { go(start, false); });
    return api;
  }

  function downscale(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var k = Math.min(1, 640 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = function () { cb(null); };
      img.src = r.result;
    };
    r.onerror = function () { cb(null); };
    r.readAsDataURL(file);
  }

  /* Añadir nodo (panel lateral). */
  function openAddNode() {
    var f = el('form', 'form-stack',
      '<div class="field"><label for="nn-tipo">Tipo de aporte</label><select id="nn-tipo"><option value="proyecto">Proyecto o experiencia de aula</option><option value="bitacora">Bitácora compartida</option><option value="paper">Paper o lectura recomendada</option></select></div>' +
      '<div class="field"><label for="nn-titulo">Título</label><input type="text" id="nn-titulo" maxlength="120" autocomplete="off" data-hj-suppress></div>' +
      '<div class="field"><label for="nn-disc">Disciplina</label><select id="nn-disc">' + D.disciplinas.map(function (d) { return '<option>' + esc(d) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="nn-tema">Tema</label><input type="text" id="nn-tema" placeholder="Evaluación, ética, planeación…" autocomplete="off" data-hj-suppress></div>' +
      '<div class="field"><label for="nn-desc">Cuéntanos de qué se trata</label><textarea id="nn-desc" rows="5" data-hj-suppress></textarea></div>' +
      '<div class="field"><label for="nn-link">Enlace (opcional)</label><input type="url" id="nn-link" placeholder="https://" autocomplete="off"></div>' +
      '<div class="field"><span class="field__label">Imagen (opcional)</span><div class="file-picker"><input class="visually-hidden" type="file" id="nn-img" accept="image/*" tabindex="-1"><button type="button" class="btn btn--secondary" data-nn-pick>Examinar archivo</button><span class="file-picker__name" data-nn-name>Ninguna imagen</span></div></div>' +
      '<p class="small text-secondary">No incluyas nombres de estudiantes ni datos personales. Tu nodo se guarda solo en este navegador.</p>' +
      '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-publicar-nodo">Publicar nodo</button></div>' +
      '<p class="status-note" role="status" data-nn-msg></p>');
    f.setAttribute('novalidate', '');
    var img = null;
    var input = f.querySelector('#nn-img');
    f.querySelector('[data-nn-pick]').addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      f.querySelector('[data-nn-name]').textContent = 'Procesando…';
      downscale(file, function (src) {
        img = src ? { tipo: 'imagen', src: src, nombre: file.name, pie: file.name } : null;
        f.querySelector('[data-nn-name]').textContent = src ? file.name : 'No pudimos leer la imagen.';
      });
    });
    var drawer = openDrawer({ kicker: 'Nodo IA', title: 'Añadir un nodo', body: f });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = f.querySelector('[data-nn-msg]');
      var titulo = f.querySelector('#nn-titulo').value.trim();
      var desc = f.querySelector('#nn-desc').value.trim();
      var link = f.querySelector('#nn-link').value.trim();
      if (!titulo || !desc) { msg.textContent = 'Escribe un título y cuéntanos de qué se trata.'; f.querySelector(titulo ? '#nn-desc' : '#nn-titulo').focus(); track('nodo_error_vacio'); return; }
      if (link && !/^https:\/\//i.test(link)) { msg.textContent = 'El enlace debe empezar por https://'; f.querySelector('#nn-link').focus(); return; }
      var item = {
        id: 'u' + Date.now(), propia: true, tipo: f.querySelector('#nn-tipo').value,
        titulo: titulo, disciplina: f.querySelector('#nn-disc').value,
        tema: f.querySelector('#nn-tema').value.trim() || 'Sin tema',
        resumen: desc.length > 180 ? desc.slice(0, 177) + '…' : desc,
        texto: desc.length > 180 ? [desc] : [], enlace: link, media: img ? [img] : [], autor: 'Tú', comentarios: []
      };
      state.nodo.propias.push(item);
      if (!S.save()) { state.nodo.propias.pop(); msg.textContent = 'No pudimos guardar tu nodo (puede que la imagen sea muy pesada). Inténtalo sin imagen.'; return; }
      track('nodo_experiencia_publicada');
      drawer.close();
      if (S.redRebuild) S.redRebuild();
      var list = nodos();
      openFeed(list, list.length - 1);
    });
  }

  /* Red 3D en canvas: arrastrar para girar, clic en un nodo para abrirlo. */
  function renderRed() {
    var stage = document.querySelector('[data-red]');
    if (!stage) return;
    var canvas = stage.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var tip = stage.querySelector('[data-red-tip]');
    var listEl = document.querySelector('[data-red-lista]');
    var countEl = document.querySelector('[data-red-count]');
    var COL = { proyecto: cssVar('--color-primary-light'), paper: cssVar('--color-cta'), bitacora: cssVar('--color-teal-tint') };
    var LINE = cssVar('--color-white');
    var list = [], pts = [], edges = [], proj = [];
    var rotY = 0.6, rotX = -0.3, auto = !REDUCE, drag = null, hover = -1, W = 0, H = 0, raf = 0;

    function build() {
      list = nodos();
      var N = list.length, idx = {};
      list.forEach(function (n, i) { idx[n.id] = i; });
      pts = list.map(function (n, i) {
        var y = 1 - (i + 0.5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
        var R = n.tipo === 'paper' ? 1 : (n.tipo === 'bitacora' ? 0.74 : 0.88);
        return { x: Math.cos(th) * r * R, y: y * R, z: Math.sin(th) * r * R };
      });
      edges = [];
      var seen = {};
      function link(a, b) { var k = Math.min(a, b) + '-' + Math.max(a, b); if (a !== b && !seen[k]) { seen[k] = 1; edges.push([a, b]); } }
      list.forEach(function (n, i) {
        n.rel.forEach(function (id) { if (idx[id] != null) link(i, idx[id]); });
        list.forEach(function (m, j) { if (j > i && m.tema.toLowerCase() === n.tema.toLowerCase()) link(i, j); });
      });
      list.forEach(function (n, i) {
        if (edges.some(function (e) { return e[0] === i || e[1] === i; })) return;
        var best = -1, bd = 9;
        pts.forEach(function (p, j) { if (j === i) return; var d = Math.pow(p.x - pts[i].x, 2) + Math.pow(p.y - pts[i].y, 2) + Math.pow(p.z - pts[i].z, 2); if (d < bd) { bd = d; best = j; } });
        if (best >= 0) link(i, best);
      });
      listEl.innerHTML = list.map(function (n, i) {
        return '<li><button type="button" class="node-chip" data-open="' + i + '"><span class="dot dot--' + n.tipo + '" aria-hidden="true"></span>' +
          '<span><strong>' + esc(n.titulo) + '</strong><span class="small text-secondary">' + TIPOS[n.tipo] + ' · ' + esc(n.tema) + (n.propia ? ' · Tu aporte' : '') + '</span></span></button></li>';
      }).join('');
      if (countEl) countEl.textContent = N + ' nodos · ' + edges.length + ' conexiones';
    }
    S.redRebuild = build;

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function project() {
      var cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      var scale = Math.min(W, H) * 0.46, f = 2.8;
      proj = pts.map(function (p, i) {
        var x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy;
        var y = p.y * cx - z * sx; z = p.y * sx + z * cx;
        var k = f / (f - z);
        return { i: i, sx: W / 2 + x * scale * k, sy: H / 2 + y * scale * k, k: k, z: z };
      });
    }
    // Tamaño base de cada nodo según su tipo (px antes de la perspectiva).
    var BASE = { proyecto: 15, bitacora: 13, paper: 12 };
    var glow = [], burst = null, T = 0;
    var STARS = [];
    for (var si = 0; si < 90; si++) {
      var sy0 = Math.random() * 2 - 1, sr = Math.sqrt(1 - sy0 * sy0), sth = Math.random() * 6.283;
      STARS.push({ x: Math.cos(sth) * sr * 2.3, y: sy0 * 2.3, z: Math.sin(sth) * sr * 2.3, a: 0.15 + Math.random() * 0.45, f: Math.random() * 6 });
    }
    function rot(p) {
      var cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      var x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy;
      var y = p.y * cx - z * sx; z = p.y * sx + z * cx;
      return { x: x, y: y, z: z };
    }
    function neighbors(i) {
      var s = {};
      edges.forEach(function (e) { if (e[0] === i) s[e[1]] = 1; if (e[1] === i) s[e[0]] = 1; });
      return s;
    }
    function radius(p) { return BASE[list[p.i].tipo] * p.k * (1 + 0.45 * (glow[p.i] || 0)); }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var scale = Math.min(W, H) * 0.46;
      // Estrellas de fondo: giran más lento para dar profundidad.
      ctx.fillStyle = LINE;
      STARS.forEach(function (s) {
        var q = rot({ x: s.x * 0.6, y: s.y * 0.6, z: s.z * 0.6 });
        var k = 2.8 / (2.8 - q.z * 0.4);
        var tw = REDUCE ? 1 : 0.65 + 0.35 * Math.sin(T * 0.0015 + s.f);
        ctx.globalAlpha = s.a * tw * (q.z > 0 ? 1 : 0.55);
        ctx.beginPath(); ctx.arc(W / 2 + q.x * scale * 0.9 * k, H / 2 + q.y * scale * 0.9 * k, 1.1 * k, 0, 6.3); ctx.fill();
      });
      var nb = hover >= 0 ? neighbors(hover) : null;
      // Conexiones y pulsos que viajan por ellas.
      ctx.strokeStyle = LINE;
      edges.forEach(function (e, ei) {
        var a = proj[e[0]], b = proj[e[1]], on = hover === e[0] || hover === e[1];
        var depth = 0.08 + ((a.z + b.z) / 2 + 1) * 0.12;
        ctx.globalAlpha = on ? 0.9 : (nb ? depth * 0.4 : depth);
        ctx.lineWidth = on ? 2.2 : 1;
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        if (!REDUCE) {
          var u = ((T * (on ? 0.0007 : 0.00025)) + ei * 0.137) % 1;
          ctx.globalAlpha = on ? 1 : 0.55 * depth / 0.32;
          ctx.fillStyle = COL[list[e[0]].tipo];
          ctx.beginPath(); ctx.arc(a.sx + (b.sx - a.sx) * u, a.sy + (b.sy - a.sy) * u, on ? 3 : 1.8, 0, 6.3); ctx.fill();
        }
      });
      // Nodos, del fondo hacia el frente.
      proj.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (p) {
        var n = list[p.i], col = COL[n.tipo], gl = glow[p.i] || 0, r = radius(p);
        var dim = nb && p.i !== hover && !nb[p.i] ? 0.35 : 1;
        var breathe = REDUCE ? 1 : 1 + 0.08 * Math.sin(T * 0.002 + p.i);
        var gr = r * (3 + 2.2 * gl) * breathe;
        var g = ctx.createRadialGradient(p.sx, p.sy, r * 0.4, p.sx, p.sy, gr);
        g.addColorStop(0, col); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = (0.22 + (p.z + 1) * 0.16 + gl * 0.45) * dim;
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx, p.sy, gr, 0, 6.3); ctx.fill();
        if (gl > 0.05 && !REDUCE) {
          // Anillos que se expanden alrededor del nodo bajo el cursor.
          for (var ring = 0; ring < 2; ring++) {
            var ph = ((T / 1100) + ring * 0.5) % 1;
            ctx.globalAlpha = (1 - ph) * 0.7 * gl;
            ctx.strokeStyle = col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(p.sx, p.sy, r * (1.2 + ph * 2.2), 0, 6.3); ctx.stroke();
          }
          ctx.strokeStyle = LINE;
        }
        var core = ctx.createRadialGradient(p.sx - r * 0.35, p.sy - r * 0.35, r * 0.1, p.sx, p.sy, r);
        core.addColorStop(0, LINE); core.addColorStop(0.35, col); core.addColorStop(1, col);
        ctx.globalAlpha = Math.min(1, 0.55 + (p.z + 1) * 0.25 + gl * 0.3) * dim;
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, 6.3); ctx.fill();
        if (n.propia) { ctx.globalAlpha = 0.9 * dim; ctx.lineWidth = 2; ctx.strokeStyle = LINE; ctx.beginPath(); ctx.arc(p.sx, p.sy, r + 5, 0, 6.3); ctx.stroke(); }
      });
      // Onda al hacer clic.
      if (burst) {
        var bp = proj[burst.i], el2 = (T - burst.t0) / 420;
        if (bp && el2 < 1) {
          ctx.globalAlpha = 1 - el2; ctx.strokeStyle = COL[list[burst.i].tipo]; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(bp.sx, bp.sy, radius(bp) + el2 * 90, 0, 6.3); ctx.stroke();
          ctx.strokeStyle = LINE;
        }
      }
      ctx.globalAlpha = 1;
      if (hover >= 0 && proj[hover]) {
        var h = proj[hover];
        tip.hidden = false;
        tip.setAttribute('data-tipo', list[hover].tipo);
        tip.innerHTML = '<span class="small">' + TIPOS[list[hover].tipo] + ' · ' + esc(list[hover].tema) + '</span><strong>' + esc(list[hover].titulo) + '</strong><span class="red__tip-cta">Clic para abrir</span>';
        tip.style.setProperty('--tx', Math.min(W - 140, Math.max(140, h.sx)) + 'px');
        tip.style.setProperty('--ty', (h.sy - radius(h) - 14) + 'px');
      } else tip.hidden = true;
    }
    function frame(now) {
      T = now || 0;
      if (auto && !drag && hover < 0) rotY += 0.0022;
      for (var gi = 0; gi < list.length; gi++) {
        var target = gi === hover ? 1 : 0;
        glow[gi] = REDUCE ? target : (glow[gi] || 0) + (target - (glow[gi] || 0)) * 0.14;
      }
      project(); draw();
      raf = window.requestAnimationFrame(frame);
    }
    function pick(e) {
      var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bz = -9;
      proj.forEach(function (p) {
        var d = Math.hypot(p.sx - mx, p.sy - my);
        if (d <= radius(p) + 8 && p.z > bz) { bz = p.z; best = p.i; }
      });
      return best;
    }
    canvas.addEventListener('pointerdown', function (e) {
      drag = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX, moved: false };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
        rotY = drag.ry + dx * 0.008;
        rotX = Math.max(-1.2, Math.min(1.2, drag.rx + dy * 0.008));
      } else {
        hover = pick(e);
        canvas.style.setProperty('cursor', hover >= 0 ? 'pointer' : 'grab');
      }
    });
    canvas.addEventListener('pointerup', function (e) {
      var d = drag; drag = null;
      if (!d) return;
      if (!d.moved) {
        var i = pick(e);
        if (i >= 0) {
          burst = { i: i, t0: T };
          track('red_nodo_clic');
          window.setTimeout(function () { openFeed(list, i); }, REDUCE ? 0 : 260);
        }
      }
      else track('red_girada');
    });
    canvas.addEventListener('pointerleave', function () { if (!drag) hover = -1; });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { rotY -= 0.2; e.preventDefault(); }
      if (e.key === 'ArrowRight') { rotY += 0.2; e.preventDefault(); }
      if (e.key === 'ArrowUp') { rotX = Math.max(-1.2, rotX - 0.2); e.preventDefault(); }
      if (e.key === 'ArrowDown') { rotX = Math.min(1.2, rotX + 0.2); e.preventDefault(); }
      if (e.key === 'Enter') {
        var front = proj.slice().sort(function (a, b) { return b.z - a.z; })[0];
        if (front) openFeed(list, front.i);
      }
    });
    stage.querySelector('[data-red-add]').addEventListener('click', openAddNode);
    stage.querySelector('[data-red-random]').addEventListener('click', function () {
      openFeed(list, Math.floor(Math.random() * list.length));
    });
    var pause = stage.querySelector('[data-red-pause]');
    function setPause() { pause.setAttribute('aria-pressed', String(!auto)); pause.textContent = auto ? 'Pausar giro' : 'Reanudar giro'; }
    pause.addEventListener('click', function () { auto = !auto; setPause(); });
    setPause();
    listEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (b) openFeed(list, Number(b.getAttribute('data-open')));
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) window.cancelAnimationFrame(raf); else raf = window.requestAnimationFrame(frame);
    });
    window.addEventListener('resize', resize);
    build();
    resize();
    raf = window.requestAnimationFrame(frame);
  }

  /* Bitácora: multimedia (fotos, video, audio) y ejemplos. */
  function bindMedia() {
    var input = document.querySelector('[data-media-input]');
    if (!input) return;
    var btn = document.querySelector('[data-media-button]');
    var prev = document.querySelector('[data-media-preview]');
    var count = document.querySelector('[data-media-count]');
    var sel = document.querySelector('[data-bitacora-session]');
    var items = [];
    function draw() {
      prev.innerHTML = items.map(function (m, i) {
        var view = m.tipo === 'imagen' ? (m.src ? '<img src="' + esc(m.src) + '" alt="' + esc(m.nombre) + '">' : '<div class="media-mock"><span class="media-dur">Procesando…</span></div>') :
          (m.url ? (m.tipo === 'video' ? '<video src="' + esc(m.url) + '" controls preload="metadata"></video>' : '<audio src="' + esc(m.url) + '" controls></audio>') :
            '<div class="media-mock' + (m.tipo === 'audio' ? ' media-mock--audio' : '') + '"><span class="media-dur">' + (m.tipo === 'video' ? 'Video' : 'Audio') + '</span></div>');
        return '<figure class="media-item">' + view + '<figcaption>' + esc(m.nombre) + '<button type="button" class="link-button" data-media-remove="' + i + '">Quitar<span class="visually-hidden"> ' + esc(m.nombre) + '</span></button></figcaption></figure>';
      }).join('');
      count.textContent = items.length ? items.length + (items.length === 1 ? ' archivo multimedia' : ' archivos multimedia') : 'Sin archivos multimedia';
    }
    function load() {
      var d = state.drafts[sel.value];
      items = (d && d.media ? d.media : []).map(function (m) { return { tipo: m.tipo, nombre: m.nombre, src: m.src }; });
      draw();
    }
    btn.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files || []);
      files.forEach(function (file) {
        if (items.length >= 4) { count.textContent = 'Puedes adjuntar hasta 4 archivos multimedia.'; return; }
        var tipo = /^image\//.test(file.type) ? 'imagen' : (/^video\//.test(file.type) ? 'video' : (/^audio\//.test(file.type) ? 'audio' : ''));
        if (!tipo) return;
        var item = { tipo: tipo, nombre: file.name };
        items.push(item);
        if (tipo === 'imagen') downscale(file, function (src) { item.src = src; draw(); });
        else item.url = URL.createObjectURL(file);
        track('multimedia_adjuntada');
      });
      input.value = '';
      draw();
    });
    prev.addEventListener('click', function (e) {
      var b = e.target.closest('[data-media-remove]');
      if (!b) return;
      items.splice(Number(b.getAttribute('data-media-remove')), 1);
      draw();
      btn.focus();
    });
    sel.addEventListener('change', load);
    document.addEventListener('click', function (e) { if (e.target.closest('[data-open-draft]')) window.setTimeout(load, 0); });
    S.getMedia = function () {
      return items.filter(function (m) { return m.tipo !== 'imagen' || m.src; })
        .map(function (m) { return { tipo: m.tipo, nombre: m.nombre, pie: m.nombre, src: m.tipo === 'imagen' ? m.src : undefined }; });
    };
    load();
  }
  function renderEjemplos() {
    var ul = document.querySelector('[data-bitacora-ejemplos]');
    if (!ul) return;
    var ex = (D.bitacorasEjemplo || []).map(function (b) { return norm(b, 'bitacora'); });
    ul.innerHTML = ex.map(function (b, i) {
      var tipos = (b.media || []).map(function (m) { return m.tipo === 'imagen' ? 'foto' : (m.tipo === 'video' ? 'video' : 'audio'); }).join(', ');
      return '<li><button type="button" class="node-chip" data-ejemplo="' + i + '"><span class="dot dot--bitacora" aria-hidden="true"></span><span><strong>' + esc(b.titulo) + '</strong><span class="small text-secondary">' + esc(b.autor) + ' · ' + esc(b.sesion) + ' · con ' + esc(tipos) + '</span></span></button></li>';
    }).join('');
    ul.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ejemplo]');
      if (!b) return;
      var body = el('div', 'stack', nodeHTML(ex[Number(b.getAttribute('data-ejemplo'))]));
      bindWaves(body);
      openDrawer({ kicker: 'Ejemplo de bitácora', title: 'Así se ve con multimedia', body: body });
      track('bitacora_ejemplo_abierto');
    });
  }
  function renderSavedMedia() {
    var box = document.querySelector('[data-saved-summary]');
    var n = new URLSearchParams(window.location.search).get('sesion');
    var d = n && state.drafts[n];
    if (!box || !d || !d.media || !d.media.length) return;
    box.appendChild(el('h3', 'saved-label', 'Multimedia'));
    var w = el('div', '', mediaHTML(d.media));
    bindWaves(w);
    box.appendChild(w);
  }

  /* ---------- Modo de navegación: entrada simulada (docente / coordinador) ----------
   * No hay usuario ni contraseña: solo se elige el modo. Se guarda en state.modo.
   * ?modo=docente o ?modo=coordinador en la URL lo fija sin pasar por la entrada (útil en Maze). */
  var urlModo = new URLSearchParams(window.location.search).get('modo');
  if (urlModo === 'docente' || urlModo === 'coordinador') { state.modo = urlModo; S.save(); }
  if (S.page === 'coordinador' && state.modo !== 'coordinador') { state.modo = 'coordinador'; S.save(); }
  function isCoord() { return state.modo === 'coordinador'; }
  function setModo(m) { state.modo = m; S.save(); track(m === 'coordinador' ? 'entrar_coordinador' : 'entrar_docente'); }

  var ICON_DOC = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5c3-1 6-1 9 1v14c-3-2-6-2-9-1z"></path><path d="M21 5c-3-1-6-1-9 1v14c3-2 6-2 9-1z"></path></svg>';
  var ICON_COORD = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"></path><rect x="5" y="11" width="3" height="6" rx="1"></rect><rect x="10.5" y="7" width="3" height="10" rx="1"></rect><rect x="16" y="4" width="3" height="13" rx="1"></rect></svg>';
  function showLogin() {
    var wrap = el('div', 'login');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'login-title');
    function option(m, t, d, ic) {
      return '<button type="button" class="login__option login__option--' + m + '" id="btn-entrar-' + m + '" data-modo="' + m + '">' +
        '<span class="login__icon">' + ic + '</span><strong>' + t + '</strong><span class="login__desc">' + d + '</span>' +
        '<span class="login__go">Entrar' + ICON_ARROW + '</span></button>';
    }
    wrap.innerHTML = '<div class="login__panel">' +
      '<div class="login__brand"><span class="brand__mark" aria-hidden="true">P<span>IA</span></span><span class="login__name">Ser profe<br>en la era de la IA</span></div>' +
      '<h2 class="login__title" id="login-title">¿Cómo quieres navegar hoy?</h2>' +
      '<p class="login__lead">Elige tu rol. Puedes cambiarlo cuando quieras desde la cabecera.</p>' +
      '<div class="login__options">' +
      option('docente', 'Docente participante', 'Continúa tu recorrido, escribe tu bitácora y explora Nodo IA.', ICON_DOC) +
      option('coordinador', 'Coordinador pedagógico', 'El mismo curso, con seguimiento de la cohorte, entregas de bitácora y edición de módulos.', ICON_COORD) +
      '</div>' +
      '<p class="login__note"><strong>Demostración.</strong> No pedimos usuario ni contraseña.</p></div>';
    document.body.appendChild(wrap);
    document.body.classList.add('has-login');
    var opts = wrap.querySelectorAll('[data-modo]');
    opts[0].focus();
    wrap.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var first = opts[0], last = opts[opts.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-modo]');
      if (!b) return;
      setModo(b.getAttribute('data-modo'));
      window.location.reload();
    });
  }

  function bindModo() {
    var head = document.querySelector('.site-header__inner');
    if (!head) return;
    var on = isCoord();
    document.body.classList.toggle('is-coord', on);
    var box = el('div', 'mode-box');
    var sw = el('button', 'mode-switch' + (on ? ' mode-switch--on' : ''),
      '<span class="mode-switch__track" aria-hidden="true"><span class="mode-switch__thumb"></span></span>Modo coordinador');
    sw.type = 'button';
    sw.id = 'btn-modo-coordinador';
    sw.setAttribute('aria-pressed', String(on));
    sw.addEventListener('click', function () {
      setModo(on ? 'docente' : 'coordinador');
      if (S.page === 'coordinador') window.location.href = root + 'index.html'; else window.location.reload();
    });
    var exit = el('button', 'link-button mode-exit', 'Cambiar de rol');
    exit.type = 'button';
    exit.id = 'btn-cambiar-rol';
    exit.addEventListener('click', function () { delete state.modo; S.save(); window.location.href = root + 'index.html'; });
    box.appendChild(sw);
    box.appendChild(exit);
    var prof = head.querySelector('.profile');
    head.insertBefore(box, prof);
    if (on && prof) prof.hidden = true;
    if (on) {
      var nav = document.querySelector('.site-nav');
      var ribbon = el('div', 'coord-ribbon',
        '<div class="container coord-ribbon__inner"><span><strong>Modo coordinador.</strong> Ves el curso como los docentes, con opciones para revisar y editar.</span>' +
        (S.page === 'coordinador' ? '' : '<a class="coord-ribbon__link" id="btn-ribbon-seguimiento" href="' + root + 'coordinador.html">Seguimiento de la cohorte →</a>') + '</div>');
      if (nav) nav.parentNode.insertBefore(ribbon, nav.nextSibling);
    }
  }

  function renderNodoCase() {
    var box = document.querySelector('[data-caso]');
    if (!box) return;
    var id = new URLSearchParams(window.location.search).get('caso');
    var c = null;
    allCases().forEach(function (x) { if (x.id === id) c = x; });
    var h1 = document.querySelector('[data-caso-titulo]');
    var crumb = document.querySelector('[data-caso-miga]');
    if (!c) {
      h1.textContent = 'No encontramos este caso';
      box.innerHTML = '<p>Puede que el enlace esté incompleto. Vuelve a Nodo IA para ver todos los casos.</p>';
      return;
    }
    h1.textContent = c.titulo;
    if (crumb) crumb.textContent = 'Caso';
    document.title = c.titulo + ' · Nodo IA · Ser profe en la era de la IA';
    var mine = state.nodo.reconocimientos[c.id] || {};

    function draw() {
      var comments = commentsOf(c);
      box.innerHTML =
        '<div class="row"><span class="pill pill--light-border">' + esc(c.disciplina) + '</span><span class="pill pill--pending">' + esc(c.tema) + '</span>' +
        '<span class="pill pill--soon">' + (c.propia ? 'Tu experiencia · Demostración local' : 'Caso de demostración') + '</span></div>' +
        (c.autores ? '<p class="node-meta">' + esc(c.autores) + ' (' + esc(c.anio) + ') · <em>' + esc(c.fuente) + '</em></p>' : '') + '<p class="lead">' + esc(c.resumen) + '</p>' + '<div class="case-text" data-glossary' + (c.propia ? ' data-hj-suppress' : '') + '>' + c.texto.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' + (c.partes ? c.partes.map(function (p) { return '<h3 class="saved-label">' + esc(p[0]) + '</h3><p>' + esc(p[1]) + '</p>'; }).join('') : '') + (c.hallazgos ? '<ul class="plain-list">' + c.hallazgos.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') + mediaHTML(c.media) + embedsHTML(c) +
        (c.claves ? '<p class="small text-secondary">Palabras clave: ' + esc(c.claves) + '</p>' : '') +
        (c.pregunta ? '<div class="panel panel--soft"><p class="eyebrow">Pregunta para conversar</p><p class="lead">' + esc(c.pregunta) + '</p></div>' : '') +
        '<section aria-labelledby="reco-title"><h2 class="h4" id="reco-title">¿Qué te deja este caso?</h2>' +
        '<p class="small text-secondary">Reconocemos los aportes con palabras, no con puntajes.</p>' +
        '<div class="chips" role="group" aria-label="Reconocimientos">' +
        D.reconocimientos.map(function (r, i) { return '<button type="button" class="chip" data-reco="' + i + '" aria-pressed="' + String(!!mine[i]) + '">' + esc(r) + '</button>'; }).join('') +
        '</div></section>' +
        '<section aria-labelledby="com-title"><h2 class="h4" id="com-title">Comentarios (' + comments.length + ')</h2>' +
        (comments.length ? '<ul class="comments">' + comments.map(function (m) {
          return '<li class="comment"' + (m.propio ? ' data-hj-suppress' : '') + '><span class="avatar avatar--sm" aria-hidden="true">' + esc(m.autor.replace(/[^A-ZÁÉÍÓÚ0-9]/g, '').slice(0, 2) || 'TÚ') + '</span><div><strong>' + esc(m.autor) + '</strong><p>' + esc(m.texto) + '</p></div></li>';
        }).join('') + '</ul>' : '<p class="text-secondary">Todavía no hay comentarios. Abre la conversación.</p>') +
        '<form class="form-stack" data-com-form novalidate><div class="field"><label for="com-texto">Tu comentario</label>' +
        '<textarea id="com-texto" rows="3" data-hj-suppress></textarea></div>' +
        '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-publicar-comentario">Publicar comentario</button>' +
        '<span class="small text-secondary">Demostración local: se guarda solo en este navegador.</span></div>' +
        '<p class="status-note" role="status" data-com-msg></p></form></section>';
      bindGlossary(box);
      bindWaves(box);
    }
    draw();

    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-reco]');
      if (!b) return;
      var i = b.getAttribute('data-reco');
      mine[i] = !mine[i];
      state.nodo.reconocimientos[c.id] = mine;
      S.save();
      b.setAttribute('aria-pressed', String(!!mine[i]));
      track('nodo_reconocimiento');
    });
    box.addEventListener('submit', function (e) {
      if (!e.target.matches('[data-com-form]')) return;
      e.preventDefault();
      var ta = box.querySelector('#com-texto');
      var v = ta.value.trim();
      if (!v) { box.querySelector('[data-com-msg]').textContent = 'Escribe tu comentario antes de publicar.'; ta.focus(); return; }
      if (!state.nodo.comentarios[c.id]) state.nodo.comentarios[c.id] = [];
      state.nodo.comentarios[c.id].push({ autor: 'Tú', texto: v, propio: true });
      S.save();
      draw();
      var note = box.querySelector('[data-com-msg]');
      note.textContent = 'Tu comentario quedó publicado en este navegador.';
      track('nodo_comentario_publicado');
    });
  }

  /* ---------- Vista de coordinador (HU-15) ---------- */
  var ESTADOS = {
    riesgo: { label: 'En riesgo', pill: 'pill--risk', rule: '10 días o más sin actividad' },
    lento: { label: 'Avance lento', pill: 'pill--slow', rule: 'entre 5 y 9 días sin actividad' },
    aldia: { label: 'Al día', pill: 'pill--ok', rule: 'menos de 5 días sin actividad' }
  };
  function estadoDe(d) { return d.dias >= 10 ? 'riesgo' : (d.dias >= 5 ? 'lento' : 'aldia'); }
  function renderCoordinador() {
    var filters = document.querySelector('[data-heat-filtros]');
    var body = document.querySelector('[data-cohorte]');
    var count = document.querySelector('[data-cohorte-conteo]');
    if (!filters || !body) return;
    var rows = D.cohorte.map(function (d) { return { d: d, e: estadoDe(d) }; });
    var active = 'todos';

    function draw() {
      var defs = [['todos', 'Todos', rows.length]].concat(Object.keys(ESTADOS).map(function (k) {
        return [k, ESTADOS[k].label, rows.filter(function (r) { return r.e === k; }).length];
      }));
      filters.innerHTML = '';
      defs.forEach(function (f) {
        var b = el('button', 'heat-btn heat-btn--' + f[0],
          '<span class="heat-btn__num">' + f[2] + '</span><span class="heat-btn__label">' + esc(f[1]) + '</span>' +
          (ESTADOS[f[0]] ? '<span class="heat-btn__rule">' + esc(ESTADOS[f[0]].rule) + '</span>' : '<span class="heat-btn__rule">toda la cohorte</span>'));
        b.type = 'button';
        b.id = 'btn-filtro-' + f[0];
        b.setAttribute('aria-pressed', String(active === f[0]));
        b.addEventListener('click', function () { active = f[0]; draw(); });
        filters.appendChild(b);
      });
      var shown = rows.filter(function (r) { return active === 'todos' || r.e === active; });
      body.innerHTML = shown.map(function (r) {
        var cells = '';
        for (var i = 1; i <= 15; i++) cells += '<span class="heat-cell ' + (i <= r.d.hechas ? 'heat-cell--done' : (i === r.d.hechas + 1 ? 'heat-cell--current' : '')) + '"></span>';
        return '<tr>' +
          '<th scope="row">' + esc(r.d.id) + '</th>' +
          '<td><span class="heat-cells" aria-hidden="true">' + cells + '</span><span class="small">' + r.d.hechas + ' de 15 sesiones</span></td>' +
          '<td>' + (r.d.dias === 0 ? 'Hoy' : 'Hace ' + r.d.dias + (r.d.dias === 1 ? ' día' : ' días')) + '</td>' +
          '<td>' + r.d.bitacoras + '</td>' +
          '<td><span class="pill ' + ESTADOS[r.e].pill + '">' + ESTADOS[r.e].label + '</span></td>' +
          '<td><button type="button" class="link-button" data-detalle="' + esc(r.d.id) + '">Ver detalle<span class="visually-hidden"> de ' + esc(r.d.id) + '</span></button></td>' +
          '</tr>';
      }).join('');
      if (count) count.textContent = 'Mostrando ' + shown.length + ' de ' + rows.length + ' docentes' + (active === 'todos' ? '.' : ' · ' + ESTADOS[active].label + '.');
    }
    draw();

    body.addEventListener('click', function (e) {
      var b = e.target.closest('[data-detalle]');
      if (!b) return;
      var r = null;
      rows.forEach(function (x) { if (x.d.id === b.getAttribute('data-detalle')) r = x; });
      if (!r) return;
      var items = '';
      for (var i = 1; i <= r.d.bitacoras; i++) items += '<li>Sesión ' + S.pad(i) + ' · bitácora entregada</li>';
      var bodyEl = el('div', 'stack',
        '<div class="row"><span class="pill ' + ESTADOS[r.e].pill + '">' + ESTADOS[r.e].label + '</span><span class="pill pill--soon">Datos de demostración</span></div>' +
        '<dl class="facts"><div><dt>Avance</dt><dd>' + r.d.hechas + ' de 15 sesiones</dd></div>' +
        '<div><dt>Última actividad</dt><dd>' + (r.d.dias === 0 ? 'Hoy' : 'Hace ' + r.d.dias + ' días') + '</dd></div>' +
        '<div><dt>Bitácoras</dt><dd>' + r.d.bitacoras + '</dd></div></dl>' +
        '<h3 class="h4">Bitácoras</h3>' +
        (items ? '<ul class="plain-list">' + items + '</ul>' : '<p class="text-secondary">Todavía no ha entregado bitácoras.</p>') +
        '<p class="small text-secondary">El contenido de las bitácoras y el envío de mensajes de acompañamiento: Disponible próximamente.</p>');
      openDrawer({ kicker: 'Seguimiento', title: r.d.id, body: bodyEl });
      track('coordinador_detalle');
    });
  }

  /* ---------- Perfil coordinador: contenido del curso y revisión (plan: PLAN-PERFIL-COORDINADOR.md) ---------- */
  // Nombres oficiales de la ficha institucional (no se editan).
  var MODULOS = [
    'Posicionamiento crítico frente a la IA en educación',
    'Mediación pedagógica y didáctica con IA',
    'Diseño curricular, evaluación y gestión académica con IA',
    'Ética, soberanía tecnológica y bienestar docente',
    'Proyecto aplicado: diseño e implementación'
  ];
  var EDITED = 'Editado por coordinación · Demostración local';
  if (!state.contenido) state.contenido = { modulos: {}, sesiones: {} };
  if (!state.revisiones) state.revisiones = {};
  var C = state.contenido;
  var dateFmt = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' });
  function fechaTexto(iso) {
    var p = String(iso || '').split('-');
    if (p.length !== 3) return '';
    return dateFmt.format(new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
  }
  function setText(node, text) { if (node) node.textContent = text; }
  function editedPill() { return el('span', 'pill pill--edited', esc(EDITED)); }

  // Aplica en las páginas del docente lo que el coordinador editó.
  function applyContent() {
    // Sesión
    if (S.page === 'sesion') {
      var n = document.body.getAttribute('data-session');
      var ov = C.sesiones[n];
      if (!ov) return;
      var row = document.querySelector('.session-head .row');
      if (row) row.appendChild(editedPill());
      var obj = document.querySelector('[aria-labelledby="obj-' + n + '"] p');
      var act = document.querySelector('[aria-labelledby="act-' + n + '"] .artifact__desc') || document.querySelector('[aria-labelledby="act-' + n + '"] p');
      var rec = document.querySelector('[aria-labelledby="rec-' + n + '"] .resource-frame');
      if (ov.publicada === false) {
        setText(document.querySelector('.session-head .lead'), 'Esta sesión no está publicada todavía.');
        setText(obj, 'Disponible próximamente.'); setText(act, 'Disponible próximamente.');
        return;
      }
      if (ov.titulo) setText(document.querySelector('.session-head .lead'), ov.titulo);
      if (ov.objetivo && obj) { obj.textContent = ov.objetivo; obj.className = ''; }
      if (ov.actividad && act) { act.textContent = ov.actividad; act.className = ''; }
      if (ov.recurso && rec) {
        rec.innerHTML = '';
        var a = el('a', 'btn btn--secondary', 'Abrir el recurso de la sesión' + ICON_ARROW);
        a.href = ov.recurso; a.target = '_blank'; a.rel = 'noopener';
        rec.appendChild(a);
      }
    }
    // Módulo de evaluación: tarjetas de sesión
    document.querySelectorAll('[data-session-card]').forEach(function (card) {
      var ov = C.sesiones[card.getAttribute('data-session-card')];
      if (!ov) return;
      var h = card.querySelector('h3'), p = card.querySelector('.session-card__body .small');
      if (ov.publicada === false) { setText(p, 'Sesión no publicada todavía.'); return; }
      if (ov.titulo) setText(h, ov.titulo);
      if (p) p.textContent = EDITED;
    });
    // Inicio: subtítulo de la tarjeta principal
    var sub = document.querySelector('[data-hero-sub]');
    if (sub) {
      var m = /Sesión (\d+)/.exec(sub.textContent);
      var ovh = m && C.sesiones[String(Number(m[1]))];
      if (ovh && ovh.titulo && ovh.publicada !== false) sub.textContent = 'Sesión ' + m[1] + ' · ' + ovh.titulo;
    }
    // Mapa e Inicio: fecha de apertura y nota de cada módulo
    var items = document.querySelectorAll('.course-map__item, .module-grid > li');
    Array.prototype.forEach.call(items, function (it, i) {
      var mo = C.modulos[String(i + 1)];
      if (!mo) return;
      var pill = it.querySelector('.pill--soon');
      if (pill && mo.apertura) pill.textContent = 'Disponible a partir del ' + fechaTexto(mo.apertura);
      if (mo.nota) {
        var host = it.querySelector('.course-map__body') || it.querySelector('.module-card');
        var note = el('p', 'small module-note');
        note.textContent = mo.nota;
        if (host) host.appendChild(note);
      }
    });
  }

  // Bitácora del docente: muestra la retroalimentación de coordinación.
  function bindFeedback() {
    var box = document.querySelector('[data-revision]');
    var sel = document.querySelector('[data-bitacora-session]');
    if (!box || !sel) return;
    function show() {
      var r = state.revisiones[sel.value];
      box.hidden = !r;
      if (!r) return;
      box.innerHTML = '<p><strong>Retroalimentación del equipo formador</strong> · ' + esc(S.timeFmt.format(new Date(r.fecha))) + '</p>';
      var p = el('p', 'prewrap'); p.textContent = r.comentario;
      box.appendChild(p);
      box.appendChild(el('p', 'small', 'Demostración local: escrita desde el perfil de coordinación en este navegador.'));
    }
    sel.addEventListener('change', show);
    document.addEventListener('click', function (e) { if (e.target.closest('[data-open-draft]')) window.setTimeout(show, 0); });
    show();
  }

  function bindCoordTabs() {
    var list = document.querySelector('[data-coord-tabs]');
    if (!list) return;
    var tabs = list.querySelectorAll('[role="tab"]');
    function select(i, focus) {
      Array.prototype.forEach.call(tabs, function (t, k) {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = k !== i;
      });
      if (focus) tabs[i].focus();
    }
    Array.prototype.forEach.call(tabs, function (t, k) { t.addEventListener('click', function () { select(k); }); });
    list.addEventListener('keydown', function (e) {
      var cur = 0;
      Array.prototype.forEach.call(tabs, function (t, k) { if (t.getAttribute('aria-selected') === 'true') cur = k; });
      if (e.key === 'ArrowRight') select((cur + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') select((cur + tabs.length - 1) % tabs.length, true);
    });
    select(0);
  }

  function bindModuleEditor() {
    var ul = document.querySelector('[data-editor-modulos]');
    if (!ul) return;
    ul.innerHTML = MODULOS.map(function (name, i) {
      var n = i + 1, mo = C.modulos[n] || {};
      var activo = n === 3;
      return '<li><form class="editor-row" data-mod="' + n + '" novalidate>' +
        '<div class="editor-row__name"><p class="eyebrow">Módulo ' + S.pad(n) + (activo ? ' · Con sesiones' : '') + '</p><h3>' + esc(name) + '</h3></div>' +
        '<div class="field"><label for="mod-fecha-' + n + '">Fecha de apertura</label><input type="date" id="mod-fecha-' + n + '" value="' + esc(mo.apertura || '') + '"></div>' +
        '<div class="field"><label for="mod-nota-' + n + '">Nota para los docentes</label><input type="text" id="mod-nota-' + n + '" maxlength="140" value="' + esc(mo.nota || '') + '" autocomplete="off"></div>' +
        '<div class="editor-row__actions"><button type="submit" class="btn btn--secondary" id="btn-guardar-modulo-' + n + '">Guardar</button><span class="small status-note" role="status"></span></div>' +
        '</form></li>';
    }).join('');
    ul.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-mod]');
      if (!f) return;
      e.preventDefault();
      var n = f.getAttribute('data-mod');
      var fecha = f.querySelector('input[type="date"]').value;
      var nota = f.querySelector('input[type="text"]').value.trim();
      if (fecha || nota) C.modulos[n] = { apertura: fecha, nota: nota }; else delete C.modulos[n];
      var ok = S.save();
      f.querySelector('.status-note').textContent = ok ? (fecha ? 'Guardado. Los docentes verán «Disponible a partir del ' + fechaTexto(fecha) + '».' : 'Guardado.') : 'No pudimos guardar. Inténtalo de nuevo.';
      if (ok) track('coordinador_modulo_editado');
    });
  }

  function bindSessionEditor() {
    var form = document.querySelector('[data-editor-sesion]');
    if (!form) return;
    var sel = form.querySelector('[data-ed-num]');
    var msg = form.querySelector('[data-ed-msg]');
    var ver = form.querySelector('[data-ed-ver]');
    var resumen = document.querySelector('[data-ed-resumen]');
    var opts = '';
    for (var i = 1; i <= 15; i++) opts += '<option value="' + i + '">Sesión ' + S.pad(i) + '</option>';
    sel.innerHTML = opts;
    function field(k) { return form.querySelector('[data-ed="' + k + '"]'); }
    function fill() {
      var ov = C.sesiones[sel.value] || {};
      ['titulo', 'objetivo', 'actividad', 'recurso'].forEach(function (k) { field(k).value = ov[k] || ''; });
      field('publicada').checked = ov.publicada !== false;
      ver.href = root + 'sesiones/sesion-' + S.pad(Number(sel.value)) + '.html';
      msg.textContent = '';
    }
    function drawResumen() {
      var html = '';
      for (var i = 1; i <= 15; i++) {
        var ov = C.sesiones[i];
        var st = !ov ? '<span class="pill pill--pending">Sin editar</span>' :
          (ov.publicada === false ? '<span class="pill pill--slow">No publicada</span>' : '<span class="pill pill--ok">Publicada</span>');
        html += '<li><span><strong>Sesión ' + S.pad(i) + '</strong><br><span class="small text-secondary">' + esc(ov && ov.titulo ? ov.titulo : (D.sesiones && D.sesiones[i - 1] ? D.sesiones[i - 1].titulo : 'Título pendiente de confirmar')) + '</span></span>' + st + '</li>';
      }
      resumen.innerHTML = html;
    }
    sel.addEventListener('change', fill);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = field('recurso').value.trim();
      if (url && !/^https:\/\//i.test(url)) {
        msg.textContent = 'El enlace del recurso debe empezar por https://';
        field('recurso').focus();
        return;
      }
      C.sesiones[sel.value] = {
        titulo: field('titulo').value.trim(), objetivo: field('objetivo').value.trim(),
        actividad: field('actividad').value.trim(), recurso: url, publicada: field('publicada').checked
      };
      if (S.save()) {
        msg.textContent = 'Cambios guardados. Ábrela con «Ver la sesión» para revisarla como docente.';
        drawResumen();
        track('coordinador_sesion_editada');
      } else msg.textContent = 'No pudimos guardar. Inténtalo de nuevo.';
    });
    form.querySelector('[data-ed-reset]').addEventListener('click', function () {
      delete C.sesiones[sel.value];
      S.save();
      fill(); drawResumen();
      msg.textContent = 'La sesión volvió a su contenido original.';
    });
    fill(); drawResumen();
  }

  function bindReview() {
    var list = document.querySelector('[data-rev-lista]');
    var det = document.querySelector('[data-rev-detalle]');
    if (!list) return;
    var labels = [['aprendizaje', 'Lo que aprendí'], ['aplicacion', 'Cómo lo aplico'], ['duda', 'Duda o hallazgo']];
    function draw() {
      var keys = Object.keys(state.drafts || {}).map(Number).sort(function (a, b) { return a - b; });
      list.innerHTML = keys.length ? keys.map(function (k) {
        var r = state.revisiones[k];
        return '<li><span><strong>Sesión ' + S.pad(k) + '</strong><br><span class="small text-secondary">Docente de este navegador</span></span>' +
          '<span class="row">' + (r ? '<span class="pill pill--ok">Revisada</span>' : '<span class="pill pill--pending">Por revisar</span>') +
          '<button type="button" class="link-button" data-rev="' + k + '">Revisar<span class="visually-hidden"> la bitácora de la sesión ' + S.pad(k) + '</span></button></span></li>';
      }).join('') : '<li><span class="text-secondary">Todavía no hay bitácoras guardadas en este navegador. Guarda una desde «Mi bitácora» con el perfil de docente.</span></li>';
    }
    function open(k) {
      var d = state.drafts[k], r = state.revisiones[k] || {};
      det.innerHTML = '<h3 class="h4">Bitácora · Sesión ' + S.pad(k) + '</h3>';
      var body = el('div', 'stack');
      body.setAttribute('data-hj-suppress', '');
      labels.forEach(function (l) {
        body.appendChild(el('h4', 'saved-label', esc(l[1])));
        var p = el('p', d[l[0]] ? 'prewrap' : 'text-secondary'); p.textContent = d[l[0]] || 'Sin texto.';
        body.appendChild(p);
      });
      if (d.archivo) { var fp = el('p', 'small'); fp.textContent = 'Evidencia: ' + d.archivo.name; body.appendChild(fp); }
      det.appendChild(body);
      var f = el('form', 'form-stack',
        '<div class="field"><label for="rev-texto">Tu retroalimentación</label><p class="field__help">Escríbela tú. El docente la verá en su bitácora.</p>' +
        '<textarea id="rev-texto" rows="4" data-hj-suppress></textarea></div>' +
        '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-guardar-retroalimentacion">Guardar retroalimentación</button></div>' +
        '<p class="status-note" role="status"></p>');
      f.querySelector('textarea').value = r.comentario || '';
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = f.querySelector('textarea').value.trim();
        var note = f.querySelector('.status-note');
        if (!v) { note.textContent = 'Escribe la retroalimentación antes de guardar.'; return; }
        state.revisiones[k] = { comentario: v, fecha: Date.now() };
        if (S.save()) { note.textContent = 'Guardada. El docente la verá en «Mi bitácora», sesión ' + S.pad(k) + '.'; draw(); track('coordinador_retroalimentacion'); }
        else note.textContent = 'No pudimos guardar. Inténtalo de nuevo.';
      });
      det.appendChild(f);
      f.querySelector('textarea').focus();
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rev]');
      if (b) open(Number(b.getAttribute('data-rev')));
    });
    draw();
  }

  /* ---------- Modo coordinador dentro de las páginas del curso ---------- */
  if (!C.opcionales) C.opcionales = [];
  function entregasDe(n) {
    var list = D.cohorte.map(function (d) { return { id: d.id, ok: d.bitacoras >= n, estado: estadoDe(d) }; });
    if (state.drafts && state.drafts[n]) list.unshift({ id: 'Docente de este navegador', ok: true, local: true, estado: 'aldia' });
    return list;
  }
  function conteo(n) { var l = entregasDe(n); return { ok: l.filter(function (x) { return x.ok; }).length, total: l.length }; }
  function reloadAfter(drawer) { if (drawer) drawer.close(); window.location.reload(); }

  function openEntregas(n) {
    var l = entregasDe(n), c = conteo(n);
    var body = el('div', 'stack',
      '<div class="entregas-sum"><span class="entregas-sum__num">' + c.ok + '<small> de ' + c.total + '</small></span><span>docentes entregaron la bitácora de la sesión ' + S.pad(n) + '</span></div>' +
      '<div class="progress" role="img" aria-label="' + c.ok + ' de ' + c.total + ' entregaron"><div class="progress__fill entregas-fill"></div></div>' +
      '<ul class="entregas">' + l.map(function (x) {
        return '<li><span class="avatar avatar--sm" aria-hidden="true">' + esc(x.local ? 'TÚ' : x.id.replace(/\D/g, '')) + '</span><span class="entregas__who">' + esc(x.id) +
          (x.estado === 'riesgo' ? ' <span class="pill pill--risk">En riesgo</span>' : '') + '</span>' +
          (x.ok ? '<span class="pill pill--ok">Entregó</span>' : '<span class="pill pill--pending">Pendiente</span>') +
          (x.local ? '<a class="link-button" href="' + root + 'bitacora.html?sesion=' + n + '#revision">Revisar</a>' : '') + '</li>';
      }).join('') + '</ul>' +
      '<p class="small text-secondary">Datos de demostración. El contenido de las bitácoras de la cohorte ficticia no existe; solo se puede revisar la del docente de este navegador.</p>');
    body.querySelector('.entregas-fill').style.setProperty('--progress', Math.round(c.ok / c.total * 100) + '%');
    openDrawer({ kicker: 'Entregas de bitácora', title: 'Sesión ' + S.pad(n), body: body });
    track('coordinador_entregas');
  }

  function editSession(n) {
    var ov = C.sesiones[n] || {};
    var f = el('form', 'form-stack',
      '<div class="field"><label for="es-titulo">Título</label><input type="text" id="es-titulo" maxlength="80" autocomplete="off"></div>' +
      '<div class="field"><label for="es-objetivo">Objetivo</label><textarea id="es-objetivo" rows="3"></textarea></div>' +
      '<div class="field"><label for="es-actividad">Actividad</label><textarea id="es-actividad" rows="3"></textarea></div>' +
      '<div class="field"><label for="es-recurso">Enlace del recurso (opcional)</label><input type="url" id="es-recurso" placeholder="https://" autocomplete="off"></div>' +
      '<label class="check"><input type="checkbox" id="es-pub"> Sesión publicada para los docentes</label>' +
      '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-coord-guardar-sesion">Guardar cambios</button><button type="button" class="btn btn--secondary" data-reset>Restablecer original</button></div>' +
      '<p class="status-note" role="status"></p>');
    f.setAttribute('novalidate', '');
    f.querySelector('#es-titulo').value = ov.titulo || '';
    f.querySelector('#es-objetivo').value = ov.objetivo || '';
    f.querySelector('#es-actividad').value = ov.actividad || '';
    f.querySelector('#es-recurso').value = ov.recurso || '';
    f.querySelector('#es-pub').checked = ov.publicada !== false;
    var d = openDrawer({ kicker: 'Editar contenido', title: 'Sesión ' + S.pad(n), body: f });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = f.querySelector('#es-recurso').value.trim();
      if (url && !/^https:\/\//i.test(url)) { f.querySelector('.status-note').textContent = 'El enlace debe empezar por https://'; return; }
      C.sesiones[n] = { titulo: f.querySelector('#es-titulo').value.trim(), objetivo: f.querySelector('#es-objetivo').value.trim(), actividad: f.querySelector('#es-actividad').value.trim(), recurso: url, publicada: f.querySelector('#es-pub').checked };
      if (S.save()) { track('coordinador_sesion_editada'); reloadAfter(d); }
    });
    f.querySelector('[data-reset]').addEventListener('click', function () { delete C.sesiones[n]; S.save(); reloadAfter(d); });
  }

  function editModule(n) {
    var mo = C.modulos[n] || {};
    var f = el('form', 'form-stack',
      '<p class="small text-secondary">' + esc(MODULOS[n - 1]) + ' (nombre oficial, no se edita).</p>' +
      '<div class="field"><label for="em-fecha">Fecha de apertura</label><input type="date" id="em-fecha"></div>' +
      '<div class="field"><label for="em-nota">Nota para los docentes</label><input type="text" id="em-nota" maxlength="140" autocomplete="off"></div>' +
      (n === 3 ? '<div class="field"><label for="em-obj">Objetivos del módulo</label><p class="field__help">Uno por línea.</p><textarea id="em-obj" rows="5"></textarea></div>' : '') +
      '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-coord-guardar-modulo">Guardar cambios</button></div>');
    f.setAttribute('novalidate', '');
    f.querySelector('#em-fecha').value = mo.apertura || '';
    f.querySelector('#em-nota').value = mo.nota || '';
    if (n === 3) f.querySelector('#em-obj').value = (mo.objetivos || []).join('\n');
    var d = openDrawer({ kicker: 'Editar módulo', title: 'Módulo ' + S.pad(n), body: f });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var next = { apertura: f.querySelector('#em-fecha').value, nota: f.querySelector('#em-nota').value.trim() };
      if (n === 3) next.objetivos = f.querySelector('#em-obj').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
      C.modulos[n] = next;
      if (S.save()) { track('coordinador_modulo_editado'); reloadAfter(d); }
    });
  }

  function editOpcional(id) {
    var cur = null;
    C.opcionales.forEach(function (o) { if (o.id === id) cur = o; });
    var f = el('form', 'form-stack',
      '<div class="field"><label for="op-titulo">Nombre del módulo</label><input type="text" id="op-titulo" maxlength="90" autocomplete="off"></div>' +
      '<div class="field"><label for="op-desc">Descripción</label><p class="field__help">Qué encontrarán los docentes y para quién es.</p><textarea id="op-desc" rows="4"></textarea></div>' +
      '<div class="field"><label for="op-dur">Duración</label><input type="text" id="op-dur" placeholder="Por ejemplo: 2 semanas · 6 h" autocomplete="off"></div>' +
      '<div class="field"><label for="op-fecha">Fecha de apertura (opcional)</label><input type="date" id="op-fecha"></div>' +
      '<div class="form-actions"><button type="submit" class="btn btn--primary" id="btn-coord-guardar-opcional">' + (cur ? 'Guardar cambios' : 'Crear módulo opcional') + '</button>' +
      (cur ? '<button type="button" class="btn btn--secondary" data-del>Eliminar módulo</button>' : '') + '</div>' +
      '<p class="status-note" role="status"></p>');
    f.setAttribute('novalidate', '');
    if (cur) {
      f.querySelector('#op-titulo').value = cur.titulo; f.querySelector('#op-desc').value = cur.descripcion;
      f.querySelector('#op-dur').value = cur.duracion || ''; f.querySelector('#op-fecha').value = cur.apertura || '';
    }
    var d = openDrawer({ kicker: 'Módulo opcional', title: cur ? 'Editar módulo opcional' : 'Crear un módulo opcional', body: f });
    var note = f.querySelector('.status-note');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var t = f.querySelector('#op-titulo').value.trim(), ds = f.querySelector('#op-desc').value.trim();
      if (!t || !ds) { note.textContent = 'Escribe el nombre y la descripción del módulo.'; return; }
      var item = cur || { id: 'op' + Date.now() };
      item.titulo = t; item.descripcion = ds; item.duracion = f.querySelector('#op-dur').value.trim(); item.apertura = f.querySelector('#op-fecha').value;
      if (!cur) C.opcionales.push(item);
      if (S.save()) { track('coordinador_modulo_opcional'); reloadAfter(d); }
    });
    var del = f.querySelector('[data-del]');
    if (del) del.addEventListener('click', function () {
      if (del.getAttribute('data-confirm') !== '1') { del.setAttribute('data-confirm', '1'); del.textContent = 'Confirmar: eliminar'; note.textContent = 'Pulsa de nuevo para eliminar el módulo opcional.'; return; }
      C.opcionales = C.opcionales.filter(function (o) { return o.id !== cur.id; });
      S.save(); reloadAfter(d);
    });
  }

  // Módulos opcionales: los ven docentes y coordinador; solo el coordinador los edita.
  function renderOpcionales() {
    if (!C.opcionales.length) return;
    var map = document.querySelector('[data-course-map]');
    var grid = document.querySelector('.module-grid');
    C.opcionales.forEach(function (o) {
      var when = o.apertura ? 'Disponible a partir del ' + fechaTexto(o.apertura) : 'Disponible próximamente';
      var edit = isCoord() ? '<button type="button" class="btn btn--secondary coord-btn" data-coord-op="' + esc(o.id) + '">Editar</button>' : '';
      if (map) {
        map.appendChild(el('li', 'course-map__item course-map__item--opcional',
          '<span class="course-map__node" aria-hidden="true">+</span><div class="course-map__card"><div class="course-map__body">' +
          '<p class="eyebrow">Módulo opcional' + (o.duracion ? ' · ' + esc(o.duracion) : '') + '</p><h3>' + esc(o.titulo) + '</h3><p class="text-secondary">' + esc(o.descripcion) + '</p></div>' +
          '<span class="row"><span class="pill pill--soon">' + esc(when) + '</span>' + edit + '</span></div>'));
      }
      if (grid) {
        grid.appendChild(el('li', '', '<div class="module-card module-card--opcional"><p class="eyebrow">Módulo opcional</p><h3>' + esc(o.titulo) + '</h3>' +
          '<p class="module-card__meta">' + esc(o.duracion || 'Duración por definir') + '</p><span class="module-card__status pill pill--soon">' + esc(when) + '</span></div>'));
      }
    });
  }

  function coordTools() {
    if (!isCoord()) return;
    // Inicio: igual que el docente, más el acceso al seguimiento de la cohorte.
    var bento = document.querySelector('.bento');
    if (S.page === 'inicio' && bento) {
      var cnt = { riesgo: 0, lento: 0, aldia: 0 };
      D.cohorte.forEach(function (d) { cnt[estadoDe(d)]++; });
      bento.parentNode.insertBefore(el('section', 'coord-card',
        '<div class="coord-card__text"><p class="eyebrow">Coordinación</p><h2>Seguimiento de la cohorte</h2>' +
        '<p class="row"><span class="pill pill--risk">' + cnt.riesgo + ' en riesgo</span><span class="pill pill--slow">' + cnt.lento + ' con avance lento</span><span class="pill pill--ok">' + cnt.aldia + ' al día</span></p></div>' +
        '<a class="btn btn--primary" id="btn-seguimiento-cohorte" href="' + root + 'coordinador.html">Ver seguimiento de la cohorte' + ICON_ARROW + '</a>'), bento.nextSibling);
    }
    // Mapa: editar cada módulo y crear módulos opcionales.
    if (S.page === 'mapa') {
      Array.prototype.forEach.call(document.querySelectorAll('.course-map__item:not(.course-map__item--opcional) .course-map__card'), function (card, i) {
        card.appendChild(el('button', 'btn btn--secondary coord-btn', 'Editar módulo')).setAttribute('data-coord-mod', String(i + 1));
      });
      var heading = document.querySelector('.view-toggle');
      if (heading) {
        var add = el('button', 'btn btn--primary', '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>Crear módulo opcional');
        add.type = 'button'; add.id = 'btn-crear-modulo-opcional'; add.setAttribute('data-coord-op', '');
        heading.parentNode.insertBefore(add, heading);
      }
    }
    // Módulo: objetivos editables y, en cada sesión, editar y ver entregas.
    if (S.page === 'modulo') {
      var objSec = document.querySelector('[aria-labelledby="objetivos-title"]');
      if (objSec) objSec.appendChild(el('button', 'btn btn--secondary coord-btn', 'Editar objetivos y fechas')).setAttribute('data-coord-mod', '3');
      Array.prototype.forEach.call(document.querySelectorAll('[data-session-card]'), function (card) {
        var n = Number(card.getAttribute('data-session-card')), c = conteo(n);
        card.appendChild(el('div', 'coord-tools coord-tools--inline',
          '<button type="button" class="coord-chip" data-coord-entregas="' + n + '"><strong>' + c.ok + '/' + c.total + '</strong> entregaron</button>' +
          '<button type="button" class="coord-chip" data-coord-sesion="' + n + '">Editar sesión</button>'));
      });
    }
    // Sesión: herramientas arriba del contenido.
    if (S.page === 'sesion') {
      var n = Number(document.body.getAttribute('data-session')), c = conteo(n), ov = C.sesiones[n];
      var art = document.querySelector('.session-content');
      if (art) art.insertBefore(el('div', 'coord-tools',
        '<p class="coord-tools__title">Herramientas de coordinación</p>' +
        '<span class="pill ' + (ov && ov.publicada === false ? 'pill--slow">No publicada' : 'pill--ok">Publicada') + '</span>' +
        '<button type="button" class="coord-chip" id="btn-coord-entregas" data-coord-entregas="' + n + '"><strong>' + c.ok + ' de ' + c.total + '</strong> entregaron la bitácora</button>' +
        '<button type="button" class="coord-chip" id="btn-coord-editar-sesion" data-coord-sesion="' + n + '">Editar sesión</button>'), art.firstChild);
    }
    // Bitácora: entregas por sesión y revisión de la bitácora de este navegador.
    if (S.page === 'bitacora') {
      var split = document.querySelector('.split');
      var rows = '';
      for (var s = 1; s <= 15; s++) { var k = conteo(s); rows += '<tr><th scope="row">Sesión ' + S.pad(s) + '</th><td><span class="heat-cells" aria-hidden="true"><span class="heat-bar"><span class="heat-bar__fill" data-w="' + Math.round(k.ok / k.total * 100) + '"></span></span></span>' + k.ok + ' de ' + k.total + '</td><td><button type="button" class="link-button" data-coord-entregas="' + s + '">Ver entregas<span class="visually-hidden"> de la sesión ' + S.pad(s) + '</span></button></td></tr>'; }
      var sec = el('section', 'section coord-section',
        '<div class="section-heading"><h2 id="entregas-title">Entregas de bitácora</h2><span class="pill pill--soon">Datos de demostración</span></div>' +
        '<div class="table-wrap" role="region" aria-labelledby="entregas-title" tabindex="0"><table class="cohort"><thead><tr><th scope="col">Sesión</th><th scope="col">Entregaron</th><th scope="col"><span class="visually-hidden">Acciones</span></th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<h2 class="section" id="revision">Revisión de bitácoras</h2><p class="text-secondary">Lee las bitácoras guardadas en este navegador y deja una retroalimentación escrita por ti. No usamos corrección automática.</p>' +
        '<div class="split"><ul class="drafts panel" data-rev-lista></ul><div class="panel" data-rev-detalle><p class="text-secondary">Elige una bitácora de la lista.</p></div></div>');
      if (split) split.parentNode.insertBefore(sec, split.nextSibling);
      Array.prototype.forEach.call(sec.querySelectorAll('[data-w]'), function (b) { b.style.setProperty('--w', b.getAttribute('data-w') + '%'); });
      bindReview();
      var q = new URLSearchParams(window.location.search).get('sesion');
      if (window.location.hash === '#revision' && q) {
        var rb = sec.querySelector('[data-rev="' + Number(q) + '"]');
        if (rb) rb.click();
        sec.querySelector('#revision').scrollIntoView();
      }
    }
    document.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-coord-entregas]'))) openEntregas(Number(b.getAttribute('data-coord-entregas')));
      else if ((b = e.target.closest('[data-coord-sesion]'))) editSession(Number(b.getAttribute('data-coord-sesion')));
      else if ((b = e.target.closest('[data-coord-mod]'))) editModule(Number(b.getAttribute('data-coord-mod')));
      else if ((b = e.target.closest('[data-coord-op]'))) editOpcional(b.getAttribute('data-coord-op'));
    });
  }

  // Objetivos del módulo editados por coordinación (visibles para todos).
  function applyObjetivos() {
    var mo = C.modulos['3'];
    var sec = document.querySelector('[aria-labelledby="objetivos-title"]');
    if (!sec || !mo || !mo.objetivos || !mo.objetivos.length) return;
    var pill = sec.querySelector('.pill--soon'), p = sec.querySelector('p.text-secondary');
    if (pill) { pill.className = 'pill pill--edited'; pill.textContent = EDITED; }
    if (p) p.replaceWith(el('ul', 'plain-list', mo.objetivos.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('')));
  }

  /* ---------- Módulo y sesiones: recorrido 3D, tarjetas, semana y Caja ---------- */
  var MOD_COL = ['--color-primary-light', '--color-cta', '--color-teal-tint', '--color-sun-tint', '--color-white'];

  /* Espiral 3D: las 10 sesiones como una escalera que sube. Distinta de la red de
     Nodo IA: aquí el orden importa, así que los nodos siguen un camino continuo. */
  function renderHelix() {
    var stage = document.querySelector('[data-helix]');
    if (!stage) return;
    var canvas = stage.querySelector('canvas'), ctx = canvas.getContext('2d');
    var tip = stage.querySelector('[data-helix-tip]');
    var SES = D.sesiones || [];
    var N = SES.length;
    var COLS = MOD_COL.map(cssVar), LINE = cssVar('--color-white'), DARK = cssVar('--color-primary-dark');
    var rotY = -0.6, rotX = 0.28, auto = !REDUCE, drag = null, hover = -1, W = 0, H = 0, T = 0, raf = 0, glow = [];
    function pos(t) {
      var a = t * Math.PI * 2.4;
      return { x: Math.cos(a) * 0.95, y: 0.95 - t * 1.9, z: Math.sin(a) * 0.95 };
    }
    var pts = SES.map(function (s, i) { return pos(i / (N - 1)); });
    function nextIdx() { for (var i = 1; i <= N; i++) if (!state.completed[i]) return i - 1; return -1; }
    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function proj(p) {
      var cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
      var x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy;
      var y = p.y * cx - z * sx; z = p.y * sx + z * cx;
      var sc = Math.min(W * 0.3, H * 0.3), k = 3 / (3 - z);
      return { sx: W / 2 + x * sc * k, sy: H / 2 + 22 + y * sc * k, z: z, k: k };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cur = nextIdx();
      // Camino continuo de la espiral, con brillo según profundidad.
      var steps = 140, prev = null;
      for (var s = 0; s <= steps; s++) {
        var t = s / steps, q = proj(pos(t)), i = Math.min(N - 1, Math.floor(t * (N - 1) + 0.0001));
        if (prev) {
          var doneSeg = state.completed[i + 1];
          ctx.globalAlpha = 0.18 + (q.z + 1) * 0.22;
          ctx.strokeStyle = doneSeg ? COLS[SES[i].fase - 1] : LINE;
          ctx.lineWidth = (doneSeg ? 4 : 2) * q.k;
          ctx.beginPath(); ctx.moveTo(prev.sx, prev.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
        }
        prev = q;
      }
      // Luz que recorre el camino.
      if (!REDUCE) {
        var lt = (T * 0.00012) % 1, lq = proj(pos(lt));
        var lg = ctx.createRadialGradient(lq.sx, lq.sy, 0, lq.sx, lq.sy, 18 * lq.k);
        lg.addColorStop(0, LINE); lg.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.7; ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lq.sx, lq.sy, 18 * lq.k, 0, 6.3); ctx.fill();
      }
      var P = pts.map(function (p, i) { var q = proj(p); q.i = i; return q; });
      P.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (q) {
        var i = q.i, col = COLS[SES[i].fase - 1], done = !!state.completed[i + 1], gl = glow[i] || 0;
        var r = ((N > 10 ? 13 : 16) + gl * 7) * q.k;
        var g = ctx.createRadialGradient(q.sx, q.sy, r * 0.3, q.sx, q.sy, r * (2.6 + gl * 1.5));
        g.addColorStop(0, col); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = (done ? 0.45 : 0.22) + gl * 0.35;
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q.sx, q.sy, r * (2.6 + gl * 1.5), 0, 6.3); ctx.fill();
        ctx.globalAlpha = 0.55 + (q.z + 1) * 0.22;
        if (done) {
          var core = ctx.createRadialGradient(q.sx - r * 0.35, q.sy - r * 0.35, r * 0.1, q.sx, q.sy, r);
          core.addColorStop(0, LINE); core.addColorStop(0.4, col); core.addColorStop(1, col);
          ctx.fillStyle = core;
        } else ctx.fillStyle = DARK;
        ctx.beginPath(); ctx.arc(q.sx, q.sy, r, 0, 6.3); ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = col; ctx.stroke();
        if (i === cur && !REDUCE) {
          var ph = (T / 1300) % 1;
          ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.arc(q.sx, q.sy, r * (1.15 + ph * 1.4), 0, 6.3); ctx.stroke();
        }
        ctx.globalAlpha = Math.min(1, 0.65 + (q.z + 1) * 0.2);
        ctx.fillStyle = done ? DARK : LINE;
        ctx.font = '700 ' + Math.round(12 * q.k) + 'px ' + cssVar('--font-heading');
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(S.pad(i + 1), q.sx, q.sy + 0.5);
      });
      ctx.globalAlpha = 1;
      if (hover >= 0) {
        var h = P[hover];
        tip.hidden = false;
        tip.innerHTML = '<span class="small">Sesión ' + S.pad(hover + 1) + ' · Módulo ' + SES[hover].fase + (state.completed[hover + 1] ? ' · Completada' : (hover === cur ? ' · En curso' : '')) + '</span><strong>' + esc(SES[hover].titulo) + '</strong>';
        tip.style.setProperty('--tx', Math.min(W - 150, Math.max(150, h.sx)) + 'px');
        tip.style.setProperty('--ty', (h.sy - 30 * h.k) + 'px');
      } else tip.hidden = true;
      return P;
    }
    var last = [];
    function frame(now) {
      T = now || 0;
      if (auto && !drag && hover < 0) rotY += 0.003;
      for (var i = 0; i < N; i++) glow[i] = REDUCE ? (i === hover ? 1 : 0) : (glow[i] || 0) + ((i === hover ? 1 : 0) - (glow[i] || 0)) * 0.15;
      last = draw();
      raf = window.requestAnimationFrame(frame);
    }
    function pick(e) {
      var r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bz = -9;
      last.forEach(function (q) { if (Math.hypot(q.sx - mx, q.sy - my) < 22 * q.k && q.z > bz) { bz = q.z; best = q.i; } });
      return best;
    }
    function open(i) { track('helix_sesion'); window.location.href = root + 'sesiones/sesion-' + S.pad(i + 1) + '.html'; }
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX, moved: false }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      if (drag) {
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
        rotY = drag.ry + dx * 0.009; rotX = Math.max(-0.9, Math.min(0.9, drag.rx + dy * 0.006));
      } else { hover = pick(e); canvas.style.setProperty('cursor', hover >= 0 ? 'pointer' : 'grab'); }
    });
    canvas.addEventListener('pointerup', function (e) { var d = drag; drag = null; if (d && !d.moved) { var i = pick(e); if (i >= 0) open(i); } else if (d) auto = false; });
    canvas.addEventListener('pointerleave', function () { if (!drag) hover = -1; });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { rotY -= 0.25; e.preventDefault(); }
      if (e.key === 'ArrowRight') { rotY += 0.25; e.preventDefault(); }
      if (e.key === 'Enter') { var c = nextIdx(); open(c < 0 ? 0 : c); }
    });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () { if (document.hidden) window.cancelAnimationFrame(raf); else raf = window.requestAnimationFrame(frame); });
    resize();
    raf = window.requestAnimationFrame(frame);
  }

  // Anillo de avance del módulo (CSS conic-gradient con la variable --p).
  function renderRing() {
    var ring = document.querySelector('[data-ring]');
    if (!ring) return;
    var N = (D.sesiones || []).length || 15, c = 0;
    for (var i = 1; i <= N; i++) if (state.completed[i]) c++;
    ring.style.setProperty('--p', Math.round(c / N * 100) + '%');
  }

  // Tarjetas de tópicos que giran en 3D.
  function bindTopics() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-topic]');
      if (!b) return;
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      if (on) track('topico_abierto');
    });
  }

  // "Tu semana": cinco pasos que el docente marca; se guardan por sesión.
  function bindWeek() {
    var ol = document.querySelector('[data-week]');
    if (!ol) return;
    var n = ol.getAttribute('data-week');
    if (!state.semana) state.semana = {};
    var marks = state.semana[n] || [false, false, false, false, false];
    var status = document.querySelector('[data-week-status]');
    var btns = ol.querySelectorAll('[data-week-step]');
    function draw() {
      var c = 0;
      Array.prototype.forEach.call(btns, function (b, i) { b.setAttribute('aria-pressed', String(!!marks[i])); if (marks[i]) c++; });
      ol.style.setProperty('--done', String(c));
      if (status) status.textContent = c === 5 ? 'Semana completa. Ya puedes marcar la sesión como completada.' : c + ' de 5 pasos de la semana · Demostración local';
    }
    ol.addEventListener('click', function (e) {
      var b = e.target.closest('[data-week-step]');
      if (!b) return;
      var i = Number(b.getAttribute('data-week-step'));
      marks[i] = !marks[i];
      state.semana[n] = marks;
      S.save();
      draw();
      track(marks[i] ? 'semana_paso_hecho' : 'semana_paso_pendiente');
    });
    draw();
  }

  // Inclinación 3D leve que sigue el cursor (tarjetas de sesión del módulo).
  function bindTilt() {
    if (REDUCE || !window.matchMedia('(hover: hover)').matches) return;
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('[data-tilt]');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 6).toFixed(2) + 'deg');
      c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + 'deg');
      c.classList.add('is-tilting');
    });
    document.addEventListener('pointerout', function (e) {
      var c = e.target.closest && e.target.closest('[data-tilt]');
      if (c && !c.contains(e.relatedTarget)) { c.classList.remove('is-tilting'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); }
    });
  }

  /* ---------- Arranque ---------- */
  applyContent();
  bindFeedback();
  if (S.page === 'coordinador') { bindCoordTabs(); bindModuleEditor(); bindSessionEditor(); bindReview(); }
  bindGlossaryEvents();
  if (S.page === 'nodo') renderRed();
  bindMedia();
  renderEjemplos();
  if (S.page === 'bitacora-guardada') renderSavedMedia();
  bindModo();
  applyObjetivos();
  renderOpcionales();
  coordTools();
  if (!state.modo && S.page !== '404') showLogin();
  if (S.page === 'nodo-caso') renderNodoCase();
  if (S.page === 'coordinador') renderCoordinador();
  renderHelix();
  renderRing();
  bindTopics();
  bindWeek();
  bindTilt();
  bindGlossary();
  bindTutor();
})();
