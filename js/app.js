(function () {
  const I18N = {
    en: {
      'nav.skip': 'Skip to content',
      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.book': 'Call for Service',
      'nav.menu': 'Menu',
      'nav.close': 'Close',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'form.service': 'Service type',
      'form.zip': 'ZIP code',
      'form.name': 'Name',
      'form.phone': 'Phone',
      'form.continue': 'Continue to request',
      'form.cardname': 'Name on card',
      'form.cardnum': 'Card number',
      'form.expiry': 'Expiry',
      'form.cvc': 'CVC',
      'form.pay': 'Submit Payment',
      'success.back': 'Back home',
      'study.disclaimer': 'Independent design study, not affiliated with SERVPRO or The ServiceMaster Company. Exact marketing copy and green palette used for a Motionsites wanderful-hero craft study only. Chrome can install this PWA from the address bar.',
      'study.short': 'Independent design study, not affiliated with SERVPRO.',
      'study.mock': 'Mock request only. Independent design study, not affiliated.',
      'study.checkout': 'Mock checkout — no real payment is processed. This is an independent design study.',
      'study.success': 'Your mock dispatch request was received. A local franchise would call you next. No payment was charged.'
    },
    pt: {
      'nav.skip': 'Saltar para o conteúdo',
      'nav.home': 'Início',
      'nav.services': 'Serviços',
      'nav.book': 'Call for Service',
      'nav.menu': 'Menu',
      'nav.close': 'Fechar',
      'theme.light': 'Claro',
      'theme.dark': 'Escuro',
      'form.service': 'Tipo de serviço',
      'form.zip': 'Código postal',
      'form.name': 'Nome',
      'form.phone': 'Telefone',
      'form.continue': 'Continuar o pedido',
      'form.cardname': 'Nome no cartão',
      'form.cardnum': 'Número do cartão',
      'form.expiry': 'Validade',
      'form.cvc': 'CVC',
      'form.pay': 'Enviar pagamento',
      'success.back': 'Voltar',
      'study.disclaimer': 'Estudo de design independente, sem vínculo com a SERVPRO ou The ServiceMaster Company. Textos de marketing e verde oficiais usados apenas para um estudo Motionsites wanderful-hero. O Chrome pode instalar este PWA a partir da barra de endereço.',
      'study.short': 'Estudo de design independente, sem vínculo com a SERVPRO.',
      'study.mock': 'Pedido simulado. Estudo de design independente, sem vínculo.',
      'study.checkout': 'Checkout simulado — nenhum pagamento real é processado. Este é um estudo de design independente.',
      'study.success': 'O pedido simulado foi recebido. Uma franquia local ligaria a seguir. Nenhum pagamento foi cobrado.'
    }
  };

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'pt' ? 'pt' : 'en';
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyI18n(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-lang') === lang ? 'true' : 'false');
    });
    const menu = document.querySelector('.menu-btn');
    if (menu) {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.textContent = dict[open ? 'nav.close' : 'nav.menu'];
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-set-theme]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-theme') === theme ? 'true' : 'false');
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07110c' : '#006341');
  }

  applyTheme(currentTheme());
  applyI18n(currentLang());

  document.addEventListener('click', function (e) {
    const langBtn = e.target.closest('[data-set-lang]');
    if (langBtn) {
      const lang = langBtn.getAttribute('data-set-lang') === 'pt' ? 'pt' : 'en';
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem('sp-lang', lang); } catch (err) {}
      applyI18n(lang);
    }
    const themeBtn = e.target.closest('[data-set-theme]');
    if (themeBtn) {
      const theme = themeBtn.getAttribute('data-set-theme') === 'dark' ? 'dark' : 'light';
      try { localStorage.setItem('sp-theme', theme); } catch (err) {}
      applyTheme(theme);
    }
  });

  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    function setMenu(open) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      navLinks.classList.toggle('is-open', open);
      applyI18n(currentLang());
    }
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  const bg = document.getElementById('heroBg');
  if (bg) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = bg.closest('.hero') || bg;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let tabVisible = document.visibilityState === 'visible';
    let onscreen = true;
    let lastTransform = '';
    let listening = false;

    function motionAllowed() {
      return !reduceMotion.matches && tabVisible && onscreen;
    }

    function apply(px, py) {
      const next = 'scale(1.08) translate3d(' + px + 'px, ' + py + 'px, 0)';
      if (next === lastTransform) return;
      lastTransform = next;
      bg.style.transform = next;
    }

    function stopLoop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      bg.style.willChange = '';
    }

    function tick() {
      raf = 0;
      if (!motionAllowed()) {
        stopLoop();
        return;
      }

      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;

      const px = Math.round(x * 100) / 100;
      const py = Math.round(y * 100) / 100;
      apply(px, py);

      if (Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05) {
        x = tx;
        y = ty;
        apply(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
        stopLoop();
        return;
      }

      raf = requestAnimationFrame(tick);
    }

    function kick() {
      if (!motionAllowed() || raf) return;
      bg.style.willChange = 'transform';
      raf = requestAnimationFrame(tick);
    }

    function onMove(e) {
      if (!motionAllowed()) return;
      tx = ((e.clientX - cx) / cx) * 20;
      ty = ((e.clientY - cy) / cy) * 20;
      kick();
    }

    function onResize() {
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
    }

    function onVisibility() {
      tabVisible = document.visibilityState === 'visible';
      if (!tabVisible) stopLoop();
    }

    function bindMove() {
      if (listening || !motionAllowed()) return;
      window.addEventListener('mousemove', onMove, { passive: true });
      listening = true;
    }

    function unbindMove() {
      if (!listening) return;
      window.removeEventListener('mousemove', onMove);
      listening = false;
    }

    function syncMotionPreference() {
      if (reduceMotion.matches) {
        unbindMove();
        stopLoop();
        tx = 0;
        ty = 0;
        x = 0;
        y = 0;
        apply(0, 0);
        return;
      }
      bindMove();
    }

    function onMq(mq, fn) {
      if (mq.addEventListener) mq.addEventListener('change', fn);
      else mq.addListener(fn);
    }

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onMq(reduceMotion, syncMotionPreference);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        onscreen = entries.some(function (entry) { return entry.isIntersecting; });
        if (!onscreen) stopLoop();
      }, { threshold: 0 });
      io.observe(hero);
    }

    syncMotionPreference();
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }
})();
