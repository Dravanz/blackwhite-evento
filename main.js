(() => {
  const D = window.BW;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- dados básicos ---------- */
  $$("[data-bind]").forEach((el) => { const v = D.evento[el.dataset.bind]; if (v) el.textContent = v; });
  $("#mapLink").href = D.evento.mapaUrl;

  /* ---------- contagem regressiva ---------- */
  const target = new Date(D.evento.data).getTime();
  const cells = { d: $('[data-c="d"]'), h: $('[data-c="h"]'), m: $('[data-c="m"]'), s: $('[data-c="s"]') };
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    let t = Math.max(0, target - Date.now()) / 1000;
    const d = Math.floor(t / 86400); t -= d * 86400;
    const h = Math.floor(t / 3600); t -= h * 3600;
    const m = Math.floor(t / 60);
    cells.d.textContent = pad(d); cells.h.textContent = pad(h);
    cells.m.textContent = pad(m); cells.s.textContent = pad(Math.floor(t - m * 60));
  };
  tick(); setInterval(tick, 1000);

  /* ---------- faixa de frases ---------- */
  const star = '<svg><use href="#star"/></svg>';
  const tickerEl = $("#ticker");
  tickerEl.innerHTML = D.frases.map((f) => `<span>${esc(f)} ${star}</span>`).join("");
  (() => {
    const items = $$("span", tickerEl);
    let widths = [], total = 0, offset = 0, last = 0, visible = true;
    const measure = () => { widths = items.map((s) => s.offsetWidth); total = widths.reduce((a, b) => a + b, 0); };
    const place = () => {
      let x = -offset;
      const vw = tickerEl.clientWidth;
      items.forEach((s, i) => {
        // frase que já saiu pela esquerda volta para o fim da fila
        let pos = x; if (pos + widths[i] < 0) pos += total;
        s.style.transform = `translate3d(${pos}px,0,0)`;
        s.style.visibility = pos > vw ? "hidden" : "visible";
        x += widths[i];
      });
    };
    const loop = (t) => {
      if (!visible) return;
      const dt = last ? Math.min(t - last, 50) : 16; last = t;
      offset = (offset + dt * 0.06) % total;
      place();
      requestAnimationFrame(loop);
    };
    const start = () => { measure(); place(); };
    start();
    document.fonts && document.fonts.ready.then(start);
    addEventListener("resize", start);
    if (!reduced) {
      new IntersectionObserver(([e]) => {
        const was = visible; visible = e.isIntersecting;
        if (visible && !was) { last = 0; requestAnimationFrame(loop); }
      }).observe(tickerEl);
      requestAnimationFrame(loop);
    }
  })();

  /* ---------- 10 mentes ---------- */
  (() => {
    const svg = $(".minds__svg"), NS = "http://www.w3.org/2000/svg";
    const c = 160, r = 146, pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      pts.push([c + r * Math.cos(a), c + r * Math.sin(a)]);
    }
    let k = 0;
    for (let i = 0; i < 10; i++) for (let j = i + 1; j < 10; j++) {
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", pts[i][0]); l.setAttribute("y1", pts[i][1]);
      l.setAttribute("x2", pts[j][0]); l.setAttribute("y2", pts[j][1]);
      l.style.transitionDelay = `${0.4 + k++ * 0.025}s`;
      svg.appendChild(l);
    }
    pts.forEach(([x, y], i) => {
      const n = document.createElementNS(NS, "circle");
      n.setAttribute("cx", x); n.setAttribute("cy", y); n.setAttribute("r", 9);
      n.style.transitionDelay = `${i * 0.06}s`;
      svg.appendChild(n);
    });
  })();

  /* ---------- palestrantes + carrossel ---------- */
  // carrossel pequeno de fotos: cada foto some sozinha se o arquivo não existir
  const strip = $("#strip"), stripTrack = $("#stripTrack");
  stripTrack.innerHTML = (D.bastidores || []).map((v) => `<figure class="shot" hidden>
      <div class="shot__img"><img src="${esc(v.foto)}" alt="${esc(v.legenda || "")}"></div>
      ${v.legenda ? `<figcaption>${esc(v.legenda)}</figcaption>` : ""}
    </figure>`).join("");
  $$("img", stripTrack).forEach((img) => {
    const fig = img.closest("figure");
    const ok = () => { fig.hidden = false; strip.hidden = false; };
    if (img.complete && img.naturalWidth) ok(); else img.addEventListener("load", ok);
    img.addEventListener("error", () => fig.remove());
  });

  const track = $("#track");
  track.innerHTML = D.palestrantes.map((p, i) => {
    const n = pad(i + 1);
    const photo = p.foto
      ? `<img src="${esc(p.foto)}" alt="${esc(p.nome)}" loading="lazy">`
      : `<div class="card__ph"><span>BW</span></div>`;
    const ig = p.instagram
      ? `<a class="card__ig" href="https://instagram.com/${esc(p.instagram)}" target="_blank" rel="noopener" aria-label="Instagram de ${esc(p.nome)}"><svg><use href="#ig"/></svg>@${esc(p.instagram)}</a>`
      : "";
    return `<article class="card" aria-label="Palestrante ${n}">
      <div class="card__photo">${photo}</div>
      <span class="card__n">${n}</span>
      ${ig}
      <div class="card__body">
        <p class="card__role">${esc(p.titulo || "")}</p>
        <h3>${esc(p.nome)}</h3>
        ${p.bio ? `<p class="card__bio">${esc(p.bio)}</p>` : ""}
      </div>
    </article>`;
  }).join("");

  const cards = $$(".card", track);
  const dots = $("#dots");
  dots.innerHTML = cards.map((_, i) => `<button aria-label="Palestrante ${i + 1}"></button>`).join("");
  const dotBtns = $$("button", dots);
  const [prev, next] = $$(".carousel__btn");
  let current = 0;

  const goTo = (i) => {
    const card = cards[Math.max(0, Math.min(cards.length - 1, i))];
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  };
  const sync = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
    current = best;
    dotBtns.forEach((b, i) => b.setAttribute("aria-current", i === best));
    prev.disabled = best === 0; next.disabled = best === cards.length - 1;
  };
  dotBtns.forEach((b, i) => b.addEventListener("click", () => goTo(i)));
  prev.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
  addEventListener("resize", sync);
  sync();

  /* ---------- frases rotativas ---------- */
  const q = $("#phrase"), bar = $("#phraseBar");
  let qi = 0;
  const showPhrase = () => {
    q.classList.add("out");
    setTimeout(() => {
      q.textContent = D.frases[qi];
      q.classList.remove("out");
      bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run");
      qi = (qi + 1) % D.frases.length;
    }, q.textContent ? 500 : 0);
  };
  showPhrase();
  setInterval(showPhrase, 6000);

  /* ---------- galeria ---------- */
  if (D.galeria.length) {
    $("#galeria").hidden = false;
    $("#gallery").innerHTML = D.galeria.map((g) => g.video
      ? `<figure><video src="${esc(g.src)}" autoplay muted loop playsinline></video></figure>`
      : `<figure><img src="${esc(g.src)}" alt="" loading="lazy"></figure>`).join("");
  }

  /* ---------- patrocinadores ---------- */
  if (D.patrocinadores.length) {
    $("#sponsors").hidden = false;
    $("#sponsorsGrid").innerHTML = D.patrocinadores.map((s) =>
      `<a href="${esc(s.url || "#")}" target="_blank" rel="noopener"><img src="${esc(s.logo)}" alt="${esc(s.nome)}"></a>`).join("");
  }

  /* ---------- contato e botões de ação ---------- */
  const C = D.contato;
  $$("[data-go]").forEach((a) => {
    const url = a.dataset.go === "patrocinar" ? C.patrocinarUrl : C.participarUrl;
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  });

  /* ---------- revelar ao rolar ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".up, .minds").forEach((el) => io.observe(el));
  // foto ganha cor quando fica bem visível na tela
  const colorIO = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("in-color", e.isIntersecting)), { threshold: 0.6 });
  $$(".shot").forEach((el) => colorIO.observe(el));

  /* ---------- botão fixo no celular ---------- */
  const dock = $("#dock");
  const hide = new Set();
  const dockIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.isIntersecting ? hide.add(e.target.id) : hide.delete(e.target.id));
    dock.classList.toggle("show", hide.size === 0);
  }, { threshold: 0.05 });
  ["topo", "convite", "contato"].forEach((id) => dockIO.observe(document.getElementById(id)));

  /* ---------- nav sólida fora do hero ---------- */
  const nav = $("#nav"), hero = $("#topo");
  const navState = () => nav.classList.toggle("solid", scrollY > hero.offsetHeight - nav.offsetHeight);
  addEventListener("scroll", navState, { passive: true }); navState();

  /* ---------- rede animada no hero ---------- */
  const cv = $("#net"), ctx = cv.getContext("2d");
  let W, H, nodes = [], running = true;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, (W * H) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const max = Math.min(150, W / 3.2);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    ctx.strokeStyle = "#fff"; ctx.fillStyle = "#fff";
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < max) { ctx.globalAlpha = (1 - d / max) * 0.5; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (running && !reduced) requestAnimationFrame(draw);
  };
  resize(); draw();
  addEventListener("resize", resize);
  new IntersectionObserver(([e]) => {
    const was = running; running = e.isIntersecting;
    if (running && !was && !reduced) requestAnimationFrame(draw);
  }).observe($("#topo"));
})();
