(function () {
  const bg = document.getElementById('heroBg');
  if (bg) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
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
      return !reduceMotion.matches && tabVisible && onscreen && finePointer.matches;
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
      if (reduceMotion.matches || !finePointer.matches) {
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
    onMq(finePointer, syncMotionPreference);

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
