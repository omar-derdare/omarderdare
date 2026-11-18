document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const links = document.getElementById('links');
  document.getElementById('burger').addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));

  // Active nav link on scroll
  const navLinks = [...links.querySelectorAll('a')];
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting)
          navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  // Reveal on scroll + animated skill bars
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        const fill = e.target.querySelector('.fill');
        if (fill) fill.style.width = fill.dataset.w;
        reveal.unobserve(e.target);
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

  // Contact form: validates, then opens the visitor's email app addressed to Omar
  const form = document.getElementById('contact-form');
  const status = document.getElementById('status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const [n, em, s, m] = ['cn', 'ce', 'cs', 'cm'].map((id) => document.getElementById(id));
    let ok = true;
    [n, em, m].forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('error', bad);
      if (bad) ok = false;
    });
    status.className = 'status';
    if (!ok) {
      status.textContent = 'Please enter your name, a valid email and a message.';
      status.classList.add('bad');
      return;
    }
    const subject = s.value.trim() || 'Portfolio message from ' + n.value.trim();
    const body = `${m.value.trim()}\n\n- ${n.value.trim()} (${em.value.trim()})`;
    status.textContent = 'Thank you! Opening your email app to send the message...';
    status.classList.add('ok');
    window.location.href =
      'mailto:oderdare@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.reset();
  });
  form.querySelectorAll('input,textarea').forEach((f) => f.addEventListener('input', () => f.classList.remove('error')));
});

// ===== v5 animations =====
document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Floating code symbols (programming style background)
  const box = document.getElementById('symbols');
  const syms = ['{ }', '</>', '=>', '();', '$', '::', '[]', '&&', '//', '<?php', '#', 'fn', '==', '++', '/**/', '->', 'null', '0x'];
  for (let i = 0; i < 34; i++) {
    const el = document.createElement('span');
    el.className = 'sym';
    el.textContent = syms[Math.floor(Math.random() * syms.length)];
    const d = 16 + Math.random() * 26;
    el.style.cssText = `left:${Math.random() * 100}%;font-size:${14 + Math.random() * 22}px;animation-duration:${d}s;animation-delay:-${Math.random() * d}s;--dx:${(Math.random() - 0.5) * 140}px;--r:${(Math.random() - 0.5) * 360}deg;--o:${0.08 + Math.random() * 0.16}`;
    box.appendChild(el);
  }

  // Typing roles
  const typed = document.getElementById('typed');
  const roles = ['Full-Stack Developer', 'PHP & Laravel Expert', 'REST API Architect', 'Clean Code Enthusiast', 'Problem Solver'];
  let r = 0, ch = 0, del = false;
  (function type() {
    const word = roles[r];
    ch += del ? -1 : 1;
    typed.textContent = word.slice(0, ch);
    let wait = del ? 35 : 75;
    if (!del && ch === word.length) { del = true; wait = 1500; }
    else if (del && ch === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
    setTimeout(type, reduce ? 99999 : wait);
  })();
  if (reduce) typed.textContent = roles[0];

  // Scroll progress, nav shrink, back-to-top
  const bar = document.getElementById('progress'), nav = document.querySelector('.nav'), top = document.getElementById('totop');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    nav.classList.toggle('scrolled', h.scrollTop > 30);
    top.classList.toggle('show', h.scrollTop > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Section headings reveal
  const headIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); headIO.unobserve(e.target); } }), { threshold: 0.4 });
  document.querySelectorAll('.head').forEach((h) => { h.classList.add('reveal'); headIO.observe(h); });

  // Stagger children of grids
  document.querySelectorAll('.skills,.minis,.projects,.stats').forEach((g) =>
    [...g.querySelectorAll(':scope > .reveal')].forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.12 + Math.floor(i / 3) * 0.06 + 's'))
  );

  // After reveal: remove delay, enable tilt + spotlight
  const doneIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    doneIO.unobserve(e.target);
    setTimeout(() => e.target.classList.add('done'), 1500);
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => doneIO.observe(el));

  const syms2 = ['{ }', 'class', '=>', '/api', '</>', 'assert', 'git', '$_'];
  document.querySelectorAll('.mini').forEach((m, i) => (m.dataset.sym = syms2[i % syms2.length]));
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project,.mini,.stat').forEach((card) => {
      card.classList.add('spot');
      card.addEventListener('mousemove', (e) => {
        const b = card.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
        card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px');
        if (card.classList.contains('done') && !card.classList.contains('stat'))
          card.style.transform = `perspective(800px) rotateX(${((y / b.height) - 0.5) * -8}deg) rotateY(${((x / b.width) - 0.5) * 8}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => (card.style.transform = ''));
    });
  }

  // Count-up numbers
  const countIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const end = +e.target.dataset.count, t0 = performance.now();
    (function step(t) {
      const p = Math.min((t - t0) / 1400, 1);
      e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + '+';
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((n) => countIO.observe(n));

  // Typing code editor
  const pre = document.getElementById('code-demo');
  const code = `<?php

class OrderController extends Controller
{
    // Thin controller, validated input, tested logic
    public function store(StoreOrderRequest $request)
    {
        $order = $this->orders->create($request->validated());

        return new OrderResource($order);
    }
}`;
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const hl = (t) =>
    esc(t).replace(
      /(\/\/.*)|\b(class|extends|public|function|return|new)\b|(\$\w+)|\b(OrderController|Controller|StoreOrderRequest|OrderResource)\b/g,
      (m, c, k, v, f) => `<span class="${c ? 'c' : k ? 'k' : v ? 'v' : 'f'}">${m}</span>`
    );
  let started = false;
  const codeIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || started) return;
    started = true;
    let i = 0;
    (function tick() {
      i += 2;
      pre.innerHTML = hl(code.slice(0, i)) + '<span class="caret"></span>';
      if (i < code.length && !reduce) setTimeout(tick, 22);
      else pre.innerHTML = hl(code);
    })();
  }), { threshold: 0.4 });
  codeIO.observe(pre);
});
