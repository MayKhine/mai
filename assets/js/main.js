/* =============================================
   PSYCHOLOGIST SITE — main.js (shared)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SHARED MENU ───────────────────────── */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    siteHeader.innerHTML = `
      <header class="nav-header" id="nav-header">
        <div class="container nav-inner">
          <a href="index.html" class="nav-logo">Mai Tun, PhD</a>
          <nav class="nav-links" id="nav-links">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="services.html">Services</a>
            <a href="resources.html">Resources</a>
            <a href="contact.html" class="nav-cta">Contact</a>
          </nav>
          <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
            <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
          </button>
        </div>
      </header>
    `;
  }

  /* ── STICKY NAV ─────────────────────────── */
  const nav = document.getElementById('nav-header');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── HAMBURGER ──────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ── ACTIVE NAV LINK ────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ──────────────────────── */
  const revealEls = document.querySelectorAll(
    '.card, .blog-card, .process-step, .section-header, .split, .trust-item, .contact-wrap, .faq-list'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 75);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── FAQ ACCORDION ──────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── CONTACT FORM ───────────────────────── */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(f => {
        if (!f.value.trim()) { f.style.borderColor = '#c0392b'; valid = false; }
        else f.style.borderColor = '';
      });
      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.querySelectorAll('input,select,textarea').forEach(f => f.value = '');
        btn.textContent = 'Send Message';
        btn.disabled = false;
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 1200);
    });
    form.querySelectorAll('input,select,textarea').forEach(f => {
      f.addEventListener('input', () => f.style.borderColor = '');
    });
  }

  /* ── CRISIS BAR ─────────────────────────── */
  const crisisBar   = document.getElementById('crisis-bar');
  const crisisClose = document.getElementById('crisis-close');
  if (crisisBar && crisisClose) {
    setTimeout(() => crisisBar.classList.add('visible'), 5000);
    crisisClose.addEventListener('click', () => {
      crisisBar.classList.add('hidden');
      setTimeout(() => crisisBar.remove(), 400);
    });
  }



  /* ── ADA: ANNOUNCE PAGE SECTION ON NAV ─────── */
  // When a nav link is clicked, move focus to main content
  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      // For in-page links (same page sections)
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: false });
        }
      }
    });
  });

  /* ── ADA: TRAP FOCUS IN MOBILE MENU ────────── */
  const mobileMenu = document.getElementById('nav-links');
  if (mobileMenu) {
    mobileMenu.addEventListener('keydown', (e) => {
      if (!mobileMenu.classList.contains('open')) return;
      if (e.key !== 'Tab') return;

      const focusable = mobileMenu.querySelectorAll('a');
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        const hamburger = document.getElementById('hamburger');
        if (hamburger) {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open menu');
          hamburger.focus();
        }
      }
    });
  }

  /* ── ADA: LIVE REGION FOR FORM FEEDBACK ────── */
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);

  const formSuccess = document.getElementById('form-success');
  if (formSuccess) {
    const observer = new MutationObserver(() => {
      if (formSuccess.classList.contains('show')) {
        liveRegion.textContent = formSuccess.textContent;
        setTimeout(() => { liveRegion.textContent = ''; }, 5000);
      }
    });
    observer.observe(formSuccess, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── ADA: SCREEN READER ONLY UTILITY CLASS ── */
  if (!document.querySelector('style#sr-only')) {
    const style = document.createElement('style');
    style.id = 'sr-only';
    style.textContent = `.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }`;
    document.head.appendChild(style);
  }

});
