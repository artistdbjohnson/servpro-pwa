(function () {
  const bg = document.getElementById('heroBg');
  if (bg) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let tx = 0, ty = 0, x = 0, y = 0;
    window.addEventListener('mousemove', (e) => {
      tx = ((e.clientX - cx) / cx) * 20;
      ty = ((e.clientY - cy) / cy) * 20;
    });
    window.addEventListener('resize', () => {
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
    });
    (function loop() {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      bg.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
      requestAnimationFrame(loop);
    })();
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
})();
