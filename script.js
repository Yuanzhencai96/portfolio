/* ══════════════════════════════════════════
   YUANZHEN CAI — PORTFOLIO SCRIPTS
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation scroll behaviour ─────────────────────────────
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveSection();
  }, { passive: true });

  // Mobile hamburger
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── Active nav highlight ─────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveSection() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }
  highlightActiveSection();

  // ── Smooth scroll for all anchor links ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Intersection Observer — reveal on scroll ─────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling items
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .project-card');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .project-card').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Parallax on hero doodles ─────────────────────────────────
  const doodles = document.querySelectorAll('.doodle');
  const parallaxRates = [0.04, 0.06, 0.03, 0.05, 0.07, 0.04, 0.05];

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    doodles.forEach((doodle, i) => {
      const rate = parallaxRates[i % parallaxRates.length];
      doodle.style.transform += ` translateY(${scrollY * rate}px)`;
    });
  }, { passive: true });

  // ── Cursor sparkle trail ─────────────────────────────────────
  const sparkleColors = ['#F4875A', '#87CEEB', '#B5EAD7', '#FFB4BA', '#D4BBFF', '#FFE5A0'];
  let lastSparkle = 0;

  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastSparkle < 60) return;
    lastSparkle = now;

    const size = Math.random() * 10 + 6;
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${e.clientX - size / 2}px;
      top: ${e.clientY - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
      z-index: 9999;
      border-radius: 50%;
      background: ${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};
      opacity: 0.8;
      transition: transform 0.6s ease, opacity 0.6s ease;
    `;
    document.body.appendChild(sparkle);

    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(0)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 700);
  });

  // ── Tilt effect on project cards ────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Image placeholder click — hint ──────────────────────────
  document.querySelectorAll('.img-placeholder').forEach(ph => {
    ph.addEventListener('click', () => {
      ph.style.background = 'rgba(244,135,90,0.12)';
      ph.style.borderColor = 'var(--orange)';
      const label = ph.querySelector('.img-ph-label');
      const orig = label ? label.textContent : '';
      if (label) {
        label.textContent = 'Drop your image here!';
        setTimeout(() => {
          ph.style.background = '';
          ph.style.borderColor = '';
          if (label) label.textContent = orig;
        }, 1200);
      }
    });
  });

  // ── Draw-in animation for timeline line on scroll ────────────
  const timelineLine = document.querySelector('.timeline-line svg path');
  if (timelineLine) {
    const length = timelineLine.getTotalLength ? timelineLine.getTotalLength() : 600;
    timelineLine.style.strokeDasharray = length;
    timelineLine.style.strokeDashoffset = length;
    timelineLine.style.transition = 'stroke-dashoffset 1.5s ease';

    const tlObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineLine.style.strokeDashoffset = 0;
          tlObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    const tlSection = document.getElementById('leadership');
    if (tlSection) tlObserver.observe(tlSection);
  }

  // ── Section entrance animations ──────────────────────────────
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    sectionObserver.observe(el);
  });

  // ── Number counter animation ─────────────────────────────────
  function animateCounter(el) {
    const target = el.textContent;
    if (!/^\d+/.test(target)) return;
    const num = parseInt(target);
    const suffix = target.replace(/[\d,]/g, '');
    let start = 0;
    const step = num / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      el.textContent = Math.round(start).toLocaleString() + suffix;
      if (start >= num) clearInterval(timer);
    }, 30);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.impact-num').forEach(el => animateCounter(el));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.project-impact').forEach(el => counterObserver.observe(el));

});
