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
  function allCases() {
    return D.casos.map(function (c) { return c; }).concat(state.nodo.propias || []);
  }
  function commentsOf(c) {
    return (c.comentarios || []).concat(state.nodo.comentarios[c.id] || []);
  }
  function renderNodoList() {
    var list = document.querySelector('[data-nodo-lista]');
    var filters = document.querySelector('[data-nodo-filtros]');
    var empty = document.querySelector('[data-nodo-vacio]');
    if (!list) return;
    var active = 'Todas';
    function draw() {
      var cases = allCases();
      var used = ['Todas'];
      cases.forEach(function (c) { if (used.indexOf(c.disciplina) < 0) used.push(c.disciplina); });
      filters.innerHTML = '';
      used.forEach(function (d) {
        var b = el('button', 'chip');
        b.type = 'button';
        b.textContent = d;
        b.setAttribute('aria-pressed', String(d === active));
        b.addEventListener('click', function () { active = d; draw(); track('nodo_filtro'); });
        filters.appendChild(b);
      });
      var shown = cases.filter(function (c) { return active === 'Todas' || c.disciplina === active; });
      list.innerHTML = shown.map(function (c) {
        var n = commentsOf(c).length;
        return '<li><article class="case-card">' +
          '<div class="row"><span class="pill pill--light-border">' + esc(c.disciplina) + '</span><span class="pill pill--pending">' + esc(c.tema) + '</span></div>' +
          '<h3><a href="' + root + 'nodo-ia-caso.html?caso=' + encodeURIComponent(c.id) + '">' + esc(c.titulo) + '</a></h3>' +
          '<p>' + esc(c.resumen) + '</p>' +
          '<div class="case-card__foot"><span class="small text-secondary">' + (c.propia ? 'Tu experiencia · Demostración local' : 'Caso de demostración') + ' · ' + n + (n === 1 ? ' comentario' : ' comentarios') + '</span>' +
          '<span class="case-card__go" aria-hidden="true">Leer caso' + ICON_ARROW + '</span></div>' +
          '</article></li>';
      }).join('');
      empty.hidden = shown.length > 0;
    }
    draw();

    var form = document.querySelector('[data-nodo-form]');
    if (!form) return;
    var sel = form.querySelector('[data-nodo-disciplina]');
    sel.innerHTML = D.disciplinas.map(function (d) { return '<option>' + esc(d) + '</option>'; }).join('');
    var msg = form.querySelector('[data-nodo-msg]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var titulo = form.querySelector('[name="titulo"]');
      var desc = form.querySelector('[name="descripcion"]');
      msg.hidden = false;
      if (!titulo.value.trim() || !desc.value.trim()) {
        msg.className = 'notice notice--error';
        msg.textContent = 'Escribe un título y cuenta tu experiencia antes de publicar.';
        (titulo.value.trim() ? desc : titulo).focus();
        track('nodo_error_vacio');
        return;
      }
      var item = {
        id: 'p' + Date.now(), propia: true,
        disciplina: sel.value,
        tema: form.querySelector('[name="tema"]').value.trim() || 'Sin tema',
        claves: form.querySelector('[name="claves"]').value.trim(),
        titulo: titulo.value.trim(),
        resumen: desc.value.trim().slice(0, 160),
        texto: [desc.value.trim()],
        pregunta: '', comentarios: []
      };
      state.nodo.propias.push(item);
      if (S.save()) {
        form.reset();
        active = 'Todas';
        draw();
        msg.className = 'notice notice--success';
        msg.textContent = 'Tu experiencia quedó publicada en este navegador. La encuentras arriba, en la lista.';
        track('nodo_experiencia_publicada');
      } else {
        state.nodo.propias.pop();
        msg.className = 'notice notice--error';
        msg.textContent = 'No pudimos publicar tu experiencia. Inténtalo de nuevo.';
      }
    });
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
        '<div class="case-text" data-glossary' + (c.propia ? ' data-hj-suppress' : '') + '>' + c.texto.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
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
        for (var i = 1; i <= 10; i++) cells += '<span class="heat-cell ' + (i <= r.d.hechas ? 'heat-cell--done' : (i === r.d.hechas + 1 ? 'heat-cell--current' : '')) + '"></span>';
        return '<tr>' +
          '<th scope="row">' + esc(r.d.id) + '</th>' +
          '<td><span class="heat-cells" aria-hidden="true">' + cells + '</span><span class="small">' + r.d.hechas + ' de 10 sesiones</span></td>' +
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
        '<dl class="facts"><div><dt>Avance</dt><dd>' + r.d.hechas + ' de 10 sesiones</dd></div>' +
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
      var act = document.querySelector('[aria-labelledby="act-' + n + '"] p');
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
    for (var i = 1; i <= 10; i++) opts += '<option value="' + i + '">Sesión ' + S.pad(i) + '</option>';
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
      for (var i = 1; i <= 10; i++) {
        var ov = C.sesiones[i];
        var st = !ov ? '<span class="pill pill--pending">Sin editar</span>' :
          (ov.publicada === false ? '<span class="pill pill--slow">No publicada</span>' : '<span class="pill pill--ok">Publicada</span>');
        html += '<li><span><strong>Sesión ' + S.pad(i) + '</strong><br><span class="small text-secondary">' + esc(ov && ov.titulo ? ov.titulo : 'Título pendiente de confirmar') + '</span></span>' + st + '</li>';
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

  /* ---------- Arranque ---------- */
  applyContent();
  bindFeedback();
  if (S.page === 'coordinador') { bindCoordTabs(); bindModuleEditor(); bindSessionEditor(); bindReview(); }
  bindGlossaryEvents();
  if (S.page === 'nodo') renderNodoList();
  if (S.page === 'nodo-caso') renderNodoCase();
  if (S.page === 'coordinador') renderCoordinador();
  bindGlossary();
  bindTutor();
})();
