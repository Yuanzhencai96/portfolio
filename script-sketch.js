/* ══════════════════════════════════════════
   YUANZHEN CAI — SKETCH PORTFOLIO
   Interactions & Animations
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const isHover = window.matchMedia('(hover: hover)').matches;

  /* ── Scroll line ──────────────────────────────────────────── */
  const scrollLine = document.getElementById('scrollLine');

  function updateScrollLine() {
    const max = document.body.scrollHeight - window.innerHeight;
    if (scrollLine && max > 0) {
      scrollLine.style.width = (window.scrollY / max * 100) + '%';
    }
  }

  /* ── Navigation hide / show ───────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastY = 0, navVisible = true;

  function updateNav() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);

    if (y > 200) {
      if (y > lastY + 4 && navVisible) {
        nav.style.transform = 'translateY(-100%)';
        navVisible = false;
      } else if (y < lastY - 4 && !navVisible) {
        nav.style.transform = 'translateY(0)';
        navVisible = true;
      }
    } else {
      nav.style.transform = 'translateY(0)';
      navVisible = true;
    }
    lastY = y;
    updateActiveNav();
    updateScrollLine();
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  /* ── Active nav highlight ─────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      const link = document.querySelector(`.nl[href="#${sec.id}"]`);
      if (link) {
        link.classList.toggle(
          'active',
          y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight
        );
      }
    });
  }

  /* ── Mobile nav ───────────────────────────────────────────── */
  const navMobBtn  = document.getElementById('navMobBtn');
  const mobOverlay = document.getElementById('mobOverlay');
  const mobClose   = document.getElementById('mobClose');

  navMobBtn?.addEventListener('click', () => {
    navMobBtn.classList.toggle('open');
    mobOverlay.classList.toggle('open');
  });
  mobClose?.addEventListener('click', () => {
    navMobBtn.classList.remove('open');
    mobOverlay.classList.remove('open');
  });
  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      navMobBtn.classList.remove('open');
      mobOverlay.classList.remove('open');
    });
  });

  /* ── Smooth anchor scroll ─────────────────────────────────── */
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

  /* ── Scroll reveal ────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObs.observe(el));

  /* ── Stagger leadership cards ─────────────────────────────── */
  const ldObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.ld-card.reveal-up').forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 130);
      });
      ldObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const ldGrid = document.querySelector('.ld-grid');
  if (ldGrid) ldObs.observe(ldGrid);

  /* ── Gallery carousel arrows ─────────────────────────────── */
  const galTrack = document.getElementById('galleryTrack');
  document.getElementById('galPrev')?.addEventListener('click', () => {
    galTrack?.scrollBy({ left: -300, behavior: 'smooth' });
  });
  document.getElementById('galNext')?.addEventListener('click', () => {
    galTrack?.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // Drag-to-scroll on the track
  if (galTrack) {
    let isDown = false, startX = 0, scrollLeft = 0;
    galTrack.addEventListener('mousedown', e => {
      isDown = true; startX = e.pageX - galTrack.offsetLeft;
      scrollLeft = galTrack.scrollLeft;
    });
    galTrack.addEventListener('mouseleave', () => { isDown = false; });
    galTrack.addEventListener('mouseup',    () => { isDown = false; });
    galTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galTrack.offsetLeft;
      galTrack.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  /* ── Stagger gallery cells ────────────────────────────────── */
  const galObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.gal-cell').forEach((cell, i) => {
        cell.style.opacity = '0';
        cell.style.transform = 'scale(0.97)';
        cell.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
        setTimeout(() => {
          cell.style.opacity = '1';
          cell.style.transform = 'scale(1)';
        }, 60 + i * 60);
      });
      galObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const galEl = document.querySelector('.gallery-wrap');
  if (galEl) galObs.observe(galEl);

  /* ── Parallax on hero doodles ─────────────────────────────── */
  const heroHds = document.querySelectorAll('.hd');

  function updateParallax() {
    const y = window.scrollY;
    heroHds.forEach((hd, i) => {
      const speed = 0.04 + (i % 3) * 0.025;
      const dir   = i % 2 === 0 ? 1 : -1;
      hd.style.transform = `translateY(${y * speed * dir}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ── Magnetic buttons ─────────────────────────────────────── */
  if (isHover) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.35;
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ── Lightbox ─────────────────────────────────────────────── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  // Build per-group image lists from all triggers
  const groups = {};
  document.querySelectorAll('.lightbox-trigger[data-group]').forEach(el => {
    const g = el.dataset.group;
    if (!groups[g]) groups[g] = [];
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    groups[g].push({
      src:     img ? img.src : '',
      caption: el.dataset.caption || (img && img.alt) || '',
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
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      if (lbCaption) lbCaption.textContent = item.caption;
      if (lbCounter) lbCounter.textContent = `${activeIdx + 1} / ${activeGroup.length}`;
      lbImg.classList.remove('fade');
    }, 200);
  }

  function prevImg() { activeIdx = (activeIdx - 1 + activeGroup.length) % activeGroup.length; renderLbImage(); }
  function nextImg() { activeIdx = (activeIdx + 1) % activeGroup.length; renderLbImage(); }

  document.querySelectorAll('.lightbox-trigger[data-group]').forEach(el => {
    el.addEventListener('click', () => {
      const g    = el.dataset.group;
      const list = groups[g] || [];
      const img  = el.tagName === 'IMG' ? el : el.querySelector('img');
      const src  = img ? img.src : '';
      const idx  = list.findIndex(item => item.src === src);
      openLightbox(g, Math.max(0, idx));
    });
  });

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', prevImg);
  lbNext?.addEventListener('click', nextImg);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevImg();
    if (e.key === 'ArrowRight') nextImg();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? nextImg() : prevImg();
  });

  /* ── Initial calls ────────────────────────────────────────── */
  updateNav();
  updateParallax();

});
