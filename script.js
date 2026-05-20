(function () {
      'use strict';
      const root = document.getElementById('root');
      const redirectUrl = root.dataset.redirectUrl || '';
      const delayMs = Math.max(0, Number(root.dataset.delayMs || 4000));

      const elCountdown = document.getElementById('countdownTime');
      const elSeconds   = document.getElementById('secondsText');
      const elBar       = document.getElementById('progressBar');
      const elBtn       = document.getElementById('downloadBtn');

      let startTime = performance.now();
      let isRedirecting = false;
      let rafId = null;

      function clamp(v, lo, hi) {
        return Math.min(hi, Math.max(lo, v));
      }

      function tick(now) {
        if (isRedirecting) return;

        const elapsed = now - startTime;
        const progress = delayMs === 0 ? 1 : clamp(elapsed / delayMs, 0, 1);
        const remSec = Math.ceil(Math.max(0, delayMs - elapsed) / 1000);

        if (elCountdown) elCountdown.textContent = remSec + 's';
        if (elSeconds) elSeconds.textContent = remSec;
        if (elBar) elBar.style.width = Math.round(progress * 100) + '%';

        if (elapsed >= delayMs) {
          go();
          return;
        }

        rafId = requestAnimationFrame(tick);
      }

      function go() {
        if (isRedirecting) return;
        isRedirecting = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (redirectUrl) window.location.assign(redirectUrl);
      }

      if (elBtn) elBtn.addEventListener('click', go);
      rafId = requestAnimationFrame(tick);

      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId);
        } else if (!isRedirecting) {
          rafId = requestAnimationFrame(tick);
        }
      });
    })();