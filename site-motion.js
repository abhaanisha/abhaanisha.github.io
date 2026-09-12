/* Shared motion + theming for the portfolio site. Loaded from every page's <helmet>. */
(function () {
  /* Warm paper ground with a clay accent — the red the Modernist tokens ship
     with reads too hot for a personal site, so both themes are retoned here. */
  var LIGHT = {
    '--color-bg': '#faf9f5', '--color-surface': '#f0eee6', '--color-text': '#1f1e1d',
    '--color-divider': 'color-mix(in srgb, #1f1e1d 24%, transparent)',
    '--color-accent': '#c96442', '--color-accent-2': '#a6674a',
    '--color-neutral-100': '#f0eee6', '--color-neutral-200': '#e4e1d5', '--color-neutral-300': '#cfcbbd',
    '--color-neutral-400': '#b0ac9f', '--color-neutral-500': '#8f8b80', '--color-neutral-600': '#6f6c63',
    '--color-neutral-700': '#524f48', '--color-neutral-800': '#38352f', '--color-neutral-900': '#1f1e1d',
    '--color-accent-100': '#f8ece6', '--color-accent-200': '#f0d7cb', '--color-accent-300': '#e4bba8',
    '--color-accent-400': '#d98f74', '--color-accent-500': '#c96442', '--color-accent-600': '#a94f33',
    '--color-accent-700': '#8a3e27', '--color-accent-800': '#632c1c', '--color-accent-900': '#3f1c12',
    '--color-accent-2-100': '#f5ede8', '--color-accent-2-200': '#e9d8cf', '--color-accent-2-300': '#d8bcae',
    '--color-accent-2-400': '#c0977f', '--color-accent-2-500': '#a6674a', '--color-accent-2-600': '#8b543b',
    '--color-accent-2-700': '#6e412d', '--color-accent-2-800': '#4f2e20', '--color-accent-2-900': '#321d14',
    /* Inverted (dark) panels on the light page: one ground, one ink, one on-dark accent step. */
    '--ink-bg': '#1f1e1d', '--ink-fg': '#faf9f5', '--ink-accent': '#d98f74'
  };
  var DARK = {
    '--color-bg': '#262624', '--color-surface': '#30302e', '--color-text': '#f5f4ef',
    '--color-divider': 'color-mix(in srgb, #f5f4ef 26%, transparent)',
    '--color-accent': '#d97757', '--color-accent-2': '#c08a6e',
    '--color-neutral-100': '#30302e', '--color-neutral-200': '#3d3d3a', '--color-neutral-300': '#4f4e4a',
    '--color-neutral-400': '#6b6a64', '--color-neutral-500': '#8b8981', '--color-neutral-600': '#aba89e',
    '--color-neutral-700': '#c9c6bb', '--color-neutral-800': '#e2dfd6', '--color-neutral-900': '#f5f4ef',
    '--color-accent-100': '#3d211a', '--color-accent-200': '#552d22', '--color-accent-300': '#733d2c',
    '--color-accent-400': '#a55840', '--color-accent-500': '#d97757', '--color-accent-600': '#e79a80',
    '--color-accent-700': '#efb9a3', '--color-accent-800': '#f6d6c7', '--color-accent-900': '#fbeae1',
    '--color-accent-2-100': '#372520', '--color-accent-2-200': '#4c342c', '--color-accent-2-300': '#67483c',
    '--color-accent-2-400': '#916653', '--color-accent-2-500': '#c08a6e', '--color-accent-2-600': '#d3a58d',
    '--color-accent-2-700': '#e2c0ad', '--color-accent-2-800': '#eedbcd', '--color-accent-2-900': '#f7ece4',
    '--ink-bg': '#1a1a19', '--ink-fg': '#f5f4ef', '--ink-accent': '#d97757'
  };
  var DEFAULT_ACCENTS = ['#ec3013', '#c96442'];
  var KEY = 'abha-site-theme';
  var root = document.documentElement;
  var accentOverride = null;

  function applyTheme(theme) {
    var map = theme === 'dark' ? DARK : LIGHT;
    for (var k in map) root.style.setProperty(k, map[k]);
    if (accentOverride && DEFAULT_ACCENTS.indexOf(accentOverride) === -1) {
      root.style.setProperty('--color-accent', accentOverride);
      root.style.setProperty('--color-accent-500', accentOverride);
      root.style.setProperty('--ink-accent', theme === 'dark' ? accentOverride
        : 'color-mix(in srgb, ' + accentOverride + ' 80%, #f7efe9)');
    }
  }
  function currentTheme() {
    try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; }
  }
  function setTheme(t) { try { localStorage.setItem(KEY, t); } catch (e) {} applyTheme(t); return t; }
  function setAccent(a) { accentOverride = a; applyTheme(currentTheme()); }
  applyTheme(currentTheme());

  var seen = new WeakSet(), counted = new WeakSet(), io = null, cio = null;
  var EASE = 'cubic-bezier(.16,.84,.44,1)';

  function offset(el) {
    var mode = el.getAttribute('data-reveal');
    if (mode === 'left') return 'translateX(-28px)';
    if (mode === 'right') return 'translateX(28px)';
    if (mode === 'scale') return 'scale(0.965)';
    if (mode === 'bar') return 'scaleX(0)';
    return 'translateY(26px)';
  }

  function scanReveal() {
    if (!io) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target, d = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { el.style.opacity = '1'; el.style.transform = 'none'; }, d);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -5% 0px', threshold: 0.02 });
    }
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      var r = el.getBoundingClientRect();
      if (r.top <= -60) return;
      var d = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      el.style.opacity = '0';
      el.style.transform = offset(el);
      var dur = el.getAttribute('data-reveal') === 'bar' ? 900 : 720;
      el.style.transition = 'opacity 720ms ' + EASE + ', transform ' + dur + 'ms ' + EASE;
      if (r.top < window.innerHeight * 0.94) {
        requestAnimationFrame(function () {
          setTimeout(function () { el.style.opacity = '1'; el.style.transform = 'none'; }, d + 60);
        });
      } else io.observe(el);
    });
  }

  function fmtCount(n, dec, pad, suffix) {
    var v = n.toFixed(dec);
    if (pad) v = String(v).padStart(pad, '0');
    return v + suffix;
  }

  /* Counters enhance markup that already carries the correct value: the real
     figure is in the DOM, and we only swap in the animation once the element
     is actually on screen. No JS, no rAF, reduced motion — the truth stands. */
  function scanCounters() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cio) {
      cio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          cio.unobserve(el);
          var target = parseFloat(el.getAttribute('data-count')) || 0;
          var dec = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
          var pad = parseInt(el.getAttribute('data-count-pad') || '0', 10);
          var suffix = el.getAttribute('data-count-suffix') || '';
          var endVal = fmtCount(target, dec, pad, suffix);
          if (reduce) { el.textContent = endVal; return; }
          var t0 = performance.now();
          (function step(now) {
            var p = Math.min(1, (now - t0) / 1150);
            el.textContent = p < 1 ? fmtCount(target * (1 - Math.pow(1 - p, 3)), dec, pad, suffix) : endVal;
            if (p < 1) requestAnimationFrame(step);
          })(t0);
        });
      }, { threshold: 0.35 });
    }
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (counted.has(el)) return;
      counted.add(el);
      cio.observe(el);
    });
  }

  /* The nav wraps its links on narrow viewports, so its height is not fixed.
     Measure it and drive both the page offset and the sticky sub-headers. */
  function syncNavHeight() {
    var nav = document.querySelector('[data-nav-shell]');
    if (!nav) return;
    var h = Math.round(nav.getBoundingClientRect().height);
    if (!h || h === window.__navH) return;
    window.__navH = h;
    root.style.setProperty('--nav-h', h + 'px');
    document.querySelectorAll('[data-screen-label]').forEach(function (el) {
      el.style.paddingTop = h + 'px';
    });
  }

  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop || 0;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 8 ? Math.min(1, Math.max(0, st / h)) : 0;
    document.querySelectorAll('[data-progress-bar]').forEach(function (el) {
      el.style.transform = 'scaleX(' + p + ')';
    });
    document.querySelectorAll('[data-nav-shell]').forEach(function (el) {
      el.style.boxShadow = st > 10 ? 'var(--shadow-sm)' : 'none';
    });
    document.querySelectorAll('[data-timeline]').forEach(function (c) {
      var fill = c.querySelector('[data-timeline-line]');
      if (!fill) return;
      var r = c.getBoundingClientRect();
      var frac = (window.innerHeight * 0.46 - r.top) / Math.max(1, r.height);
      fill.style.height = (Math.max(0, Math.min(1, frac)) * 100) + '%';
    });
    document.querySelectorAll('[data-node]').forEach(function (n) {
      var on = n.getBoundingClientRect().top < window.innerHeight * 0.52;
      n.style.background = on ? 'var(--color-accent)' : 'var(--color-bg)';
      n.style.borderColor = on ? 'var(--color-accent)' : 'var(--color-divider)';
    });
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      el.style.transform = 'translate3d(0,' + (st * f).toFixed(2) + 'px,0)';
    });
  }

  function init() {
    if (!window.__smBound) {
      window.__smBound = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { syncNavHeight(); onScroll(); });
    }
    scanReveal();
    scanCounters();
    syncNavHeight();
    onScroll();
  }
  function boot() { init(); [120, 420, 900, 1800, 3200, 5000].forEach(function (t) { setTimeout(init, t); }); }

  window.SiteMotion = { applyTheme: applyTheme, currentTheme: currentTheme, setTheme: setTheme, setAccent: setAccent, init: init, boot: boot };
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
