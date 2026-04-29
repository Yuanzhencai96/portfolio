/* ══════════════════════════════════════════
   YUANZHEN CAI — PROFESSIONAL PORTFOLIO
   Interactions & Animations
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const isHover = window.matchMedia('(hover: hover)').matches;

  /* ── Custom cursor ─────────────────────────────────────────── */
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');

  if (isHover && ring && dot) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    (function rafLoop() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(rafLoop);
    })();

    const hoverEls = 'a, button, .pg-wrap, .ld-img-wrap, .proj-visual, .gal-cell, .lightbox-trigger';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));
  }

  /* ── Scroll progress bar ───────────────────────────────────── */
  const scrollBar = document.getElementById('scrollBar');
  function updateScrollBar() {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (scrollBar) scrollBar.style.width = pct + '%';
  }

  /* ── Navigation — hide/show on scroll direction ────────────── */
  const header = document.getElementById('header');
  let lastY = 0, headerVisible = true;

  function updateNav() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);

    if (y > 200) {
      if (y > lastY + 4 && headerVisible) {
        header.style.transform = 'translateY(-100%)';
        headerVisible = false;
      } else if (y < lastY - 4 && !headerVisible) {
        header.style.transform = 'translateY(0)';
        headerVisible = true;
      }
    } else {
      header.style.transform = 'translateY(0)';
      headerVisible = true;
    }
    lastY = y;
    updateActiveNav();
    updateScrollBar();
    updateParallax();
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  /* ── Active nav highlight ──────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nl');

  function updateActiveNav() {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const link = document.querySelector(`.nl[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight);
    });
  }

  /* ── Mobile nav ────────────────────────────────────────────── */
  const navMobBtn = document.getElementById('navMobBtn');
  const mobMenu   = document.getElementById('mobMenu');

  navMobBtn?.addEventListener('click', () => {
    navMobBtn.classList.toggle('open');
    mobMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      navMobBtn.classList.remove('open');
      mobMenu.classList.remove('open');
    });
  });

  /* ── Smooth anchor scroll ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });

  /* ── Hero character-by-character reveal ────────────────────── */
  document.querySelectorAll('.reveal-chars').forEach(el => {
    const chars = el.textContent.split('');
    el.innerHTML = chars.map((c, i) => {
      if (c === ' ') return `<span style="display:inline-block;width:0.25em"> </span>`;
      return `<span class="hero-char" style="animation-delay:${0.08 + i * 0.045}s">${c}</span>`;
    }).join('');
  });

  /* ── Scroll reveal (Intersection Observer) ─────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -70px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

  /* ── Number counter animation ──────────────────────────────── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.count-up[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = target / 55;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = Math.round(cur);
          if (cur >= target) clearInterval(timer);
        }, 28);
      });
      countObs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  const hero = document.getElementById('hero');
  if (hero) countObs.observe(hero);

  /* ── Parallax on project hero images ───────────────────────── */
  const parallaxSections = document.querySelectorAll('.parallax-section');

  function updateParallax() {
    parallaxSections.forEach(section => {
      const img = section.querySelector('.parallax-img');
      if (!img) return;
      const rect = section.getBoundingClientRect();
      const ratio = rect.top / window.innerHeight; // +1 (above) to -1 (below)
      const offset = ratio * 55;
      img.style.transform = `translateY(${offset}px)`;
    });
  }

  /* ── Magnetic button effect ────────────────────────────────── */
  if (isHover) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.38;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.38;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── Lightbox ──────────────────────────────────────────────── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  // Build per-group image lists
  const groups = {};
  document.querySelectorAll('.lightbox-trigger[data-group]').forEach(el => {
    const g = el.dataset.group;
    if (!groups[g]) groups[g] = [];
    const img = el.querySelector('img') || el;
    groups[g].push({
      src:     img.src || el.src,
      caption: el.dataset.caption || img.alt || '',
    });
  });

  let activeGroup = [], activeIdx = 0;

  function openLightbox(group, idx) {
    activeGroup = groups[group] || [];
    activeIdx   = idx;
    renderLbImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLbImage() {
    lbImg.classList.add('fade');
    setTimeout(() => {
      const item = activeGroup[activeIdx];
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      lbCaption.textContent = item.caption;
      lbCounter.textContent = `${activeIdx + 1} / ${activeGroup.length}`;
      lbImg.classList.remove('fade');
    }, 200);
  }

  function prevImage() { activeIdx = (activeIdx - 1 + activeGroup.length) % activeGroup.length; renderLbImage(); }
  function nextImage() { activeIdx = (activeIdx + 1) % activeGroup.length; renderLbImage(); }

  document.querySelectorAll('.lightbox-trigger[data-group]').forEach((el, _i) => {
    el.addEventListener('click', () => {
      const g   = el.dataset.group;
      const list = groups[g] || [];
      const img  = el.querySelector('img') || el;
      const src  = img.src || el.src;
      const idx  = list.findIndex(item => item.src === src);
      openLightbox(g, Math.max(0, idx));
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click',  prevImage);
  lbNext?.addEventListener('click',  nextImage);

  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? nextImage() : prevImage();
  });

  /* ── Stagger leadership cards ──────────────────────────────── */
  const ldObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.ld-card.reveal-up').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 120);
      });
      ldObs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  const ldGrid = document.querySelector('.ld-grid');
  if (ldGrid) ldObs.observe(ldGrid);

  /* ── Project cards fade in on scroll ──────────────────────── */
  const projObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        projObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.proj').forEach(p => {
    p.style.opacity = '0';
    p.style.transform = 'translateY(50px)';
    p.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    projObs.observe(p);
  });

  /* ── Gallery cells stagger ─────────────────────────────────── */
  const galObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.gal-cell').forEach((cell, i) => {
        cell.style.opacity = '0';
        cell.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
        cell.style.transform = 'scale(0.97)';
        setTimeout(() => {
          cell.style.opacity = '1';
          cell.style.transform = 'scale(1)';
        }, 50 + i * 60);
      });
      galObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const galEl = document.querySelector('.personal-gallery');
  if (galEl) galObs.observe(galEl);

  /* ── Initial call ──────────────────────────────────────────── */
  updateNav();
  updateParallax();

});
