/* =================================================================
   Tibay Builders & Supply Co. — Main Script (vanilla JS, no libraries)

   CONTENTS
   1.  Helpers
   2.  Images (reads window.SITE_IMAGES from index.html)
   3.  Page loader
   4.  Scroll effects: navbar, progress bar, hero parallax
   5.  Mobile menu
   6.  Active nav link highlight
   7.  Scroll-reveal animations
   8.  Count-up stats
   9.  Project filter
   10. Project lightbox
   11. Testimonials carousel
   12. FAQ accordion
   13. Quote form (validation + Formspree)
   14. Footer year
   ================================================================= */
(function () {
  'use strict';

  /* ---------- 1. HELPERS ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supportsIO = 'IntersectionObserver' in window;

  /* ---------- 2. IMAGES ---------- */
  var IMAGES = window.SITE_IMAGES || {};

  // Returns an Unsplash URL resized to the given width. Other URLs are returned unchanged.
  function sized(url, width) {
    if (!url || url.indexOf('images.unsplash.com') === -1) return url;
    try {
      var u = new URL(url);
      u.searchParams.set('w', width);
      return u.toString();
    } catch (e) { return url; }
  }

  // Fill every <img data-img="key"> with a responsive src/srcset.
  // They keep loading="lazy" from the HTML, so the browser only downloads them near the viewport.
  $$('img[data-img]').forEach(function (img) {
    var url = IMAGES[img.getAttribute('data-img')];
    if (!url) return;
    if (url.indexOf('images.unsplash.com') !== -1) {
      img.srcset = [480, 800, 1200].map(function (w) { return sized(url, w) + ' ' + w + 'w'; }).join(', ');
      img.sizes = img.closest('.why') ? '(min-width: 1024px) 480px, 100vw' : '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw';
    }
    img.src = sized(url, 800);
  });

  // Hero background (CSS variable used by .hero__bg)
  if (IMAGES.hero) {
    var heroWidth = window.innerWidth > 1280 ? 2000 : window.innerWidth > 768 ? 1400 : 900;
    document.documentElement.style.setProperty('--hero-img', 'url("' + sized(IMAGES.hero, heroWidth) + '")');
  }

  /* ---------- 3. PAGE LOADER ---------- */
  var loader = $('#loader');
  function finishLoading() {
    if (loader) loader.classList.add('is-hidden');
    document.body.classList.add('is-loaded'); // starts the hero text animation
  }
  // Keep the loader short: hide after ~0.75s (bricks finish stacking), never longer.
  setTimeout(finishLoading, reducedMotion ? 0 : 750);

  /* ---------- 4. SCROLL EFFECTS ---------- */
  var nav = $('#nav');
  var progress = $('#progress');
  var heroBg = $('#hero-bg');
  var parallaxOn = !reducedMotion && window.matchMedia('(min-width: 1024px)').matches;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    nav.classList.toggle('is-scrolled', y > 40);
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';

    // Hero parallax: background moves slower than the page (desktop only)
    if (parallaxOn && heroBg && y < window.innerHeight * 1.2) {
      heroBg.style.translate = '0 ' + (y * 0.3).toFixed(1) + 'px';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', function () {
    parallaxOn = !reducedMotion && window.matchMedia('(min-width: 1024px)').matches;
    if (!parallaxOn && heroBg) heroBg.style.translate = '';
  });
  onScroll();

  /* ---------- 5. MOBILE MENU ---------- */
  var toggle = $('#nav-toggle');
  var menu = $('#nav-menu');
  var backdrop = document.createElement('div');
  backdrop.className = 'nav__backdrop';
  document.body.appendChild(backdrop);

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('no-scroll', open);
    if (open) { var first = $('a', menu); if (first) first.focus(); }
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  backdrop.addEventListener('click', function () { setMenu(false); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  // Close the mobile menu if the screen becomes desktop-sized
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  /* ---------- 6. ACTIVE NAV LINK ---------- */
  var navLinks = $$('.nav__links a');
  if (supportsIO) {
    var linkFor = {};
    navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = linkFor[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- 7. SCROLL-REVEAL ---------- */
  var reveals = $$('.reveal');
  function markDone(el) {
    el.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'opacity') return;
      el.classList.add('is-done');
      el.removeEventListener('transitionend', handler);
    });
  }
  if (supportsIO && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        markDone(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible', 'is-done'); });
  }

  // Draw the orange line through the process timeline
  var timeline = $('#timeline');
  if (timeline) {
    if (supportsIO && !reducedMotion) {
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { timeline.classList.add('is-drawn'); obs.disconnect(); }
      }, { threshold: 0.3 }).observe(timeline);
    } else {
      timeline.classList.add('is-drawn');
    }
  }

  /* ---------- 8. COUNT-UP STATS ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    function step(now) {
      if (!start) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = $$('.count');
  if (supportsIO && !reducedMotion) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = '0' + (el.getAttribute('data-suffix') || '');
      countObserver.observe(el);
    });
  }

  /* ---------- 9. PROJECT FILTER ---------- */
  var filterBtns = $$('.filter');
  var projects = $$('.project');
  var filterTimer;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      // 1) fade out everything that should hide
      projects.forEach(function (p) {
        var show = cat === 'all' || p.getAttribute('data-category') === cat;
        if (!show) p.classList.add('is-hiding');
      });

      // 2) after the fade, remove hidden cards from the layout and fade the rest in
      clearTimeout(filterTimer);
      filterTimer = setTimeout(function () {
        projects.forEach(function (p) {
          var show = cat === 'all' || p.getAttribute('data-category') === cat;
          p.classList.toggle('is-hidden', !show);
          if (show) {
            p.classList.add('is-visible', 'is-hiding');
            void p.offsetWidth; // restart transition
            p.classList.remove('is-hiding');
          }
        });
      }, reducedMotion ? 0 : 320);
    });
  });

  /* ---------- 10. PROJECT LIGHTBOX ---------- */
  var lightbox = $('#lightbox');
  var lbImg = $('#lightbox-img');
  var lbTitle = $('#lightbox-title');
  var lbMeta = $('#lightbox-meta');
  var lbDesc = $('#lightbox-desc');
  var lbIndex = 0;
  var lastFocus = null;

  function visibleProjects() { return projects.filter(function (p) { return !p.classList.contains('is-hidden'); }); }

  function showProject(project) {
    var img = $('img', project);
    var key = img.getAttribute('data-img');
    lbImg.src = sized(IMAGES[key], 1400) || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbTitle.textContent = $('.project__title', project).textContent;
    lbMeta.innerHTML = $('.project__meta', project).innerHTML;
    lbDesc.textContent = $('.project__desc', project).textContent;
    lightbox.classList.remove('is-switching');
    void lightbox.offsetWidth;
    lightbox.classList.add('is-switching');
  }

  function openLightbox(project) {
    lastFocus = document.activeElement;
    lbIndex = visibleProjects().indexOf(project);
    showProject(project);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    $('.lightbox__close', lightbox).focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  function stepLightbox(dir) {
    var list = visibleProjects();
    lbIndex = (lbIndex + dir + list.length) % list.length;
    showProject(list[lbIndex]);
  }

  projects.forEach(function (p) {
    $('.project__btn', p).addEventListener('click', function () { openLightbox(p); });
  });
  $$('[data-close]', lightbox).forEach(function (el) { el.addEventListener('click', closeLightbox); });
  $('#lb-prev').addEventListener('click', function () { stepLightbox(-1); });
  $('#lb-next').addEventListener('click', function () { stepLightbox(1); });

  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
    // Keep keyboard focus inside the dialog
    if (e.key === 'Tab') {
      var focusables = $$('button', lightbox);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- 11. TESTIMONIALS CAROUSEL ---------- */
  var carousel = $('#carousel');
  var track = $('#carousel-track');
  var slides = $$('.slide', track);
  var dotsWrap = $('#carousel-dots');
  var current = 0;
  var autoTimer = null;
  var AUTO_DELAY = 6000; // milliseconds between slides

  // Build one dot per slide
  var dots = slides.map(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    b.addEventListener('click', function () { goTo(i); restartAuto(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * current) + '%)';
    slides.forEach(function (s, idx) {
      var active = idx === current;
      s.setAttribute('aria-hidden', String(!active));
      // Hidden slides should not be reachable by keyboard
      $$('a, button', s).forEach(function (el) { el.tabIndex = active ? 0 : -1; });
    });
    dots.forEach(function (d, idx) {
      if (idx === current) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  function startAuto() {
    if (reducedMotion || autoTimer) return;
    autoTimer = setInterval(function () { goTo(current + 1); }, AUTO_DELAY);
  }
  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
  function restartAuto() { stopAuto(); startAuto(); }

  $('#carousel-prev').addEventListener('click', function () { goTo(current - 1); restartAuto(); });
  $('#carousel-next').addEventListener('click', function () { goTo(current + 1); restartAuto(); });

  // Pause while the user hovers or focuses inside the carousel
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Swipe support (touch + mouse drag) using Pointer Events
  var viewport = $('.carousel__viewport', carousel);
  var dragStartX = 0, dragDX = 0, dragging = false;
  viewport.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true; dragStartX = e.clientX; dragDX = 0;
    track.classList.add('is-dragging');
    stopAuto();
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dragDX = e.clientX - dragStartX;
    var pct = (dragDX / viewport.offsetWidth) * 100;
    track.style.transform = 'translateX(' + (-100 * current + pct) + '%)';
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    if (Math.abs(dragDX) > viewport.offsetWidth * 0.18) goTo(current + (dragDX < 0 ? 1 : -1));
    else goTo(current);
    startAuto();
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  goTo(0);
  // Only auto-slide while the carousel is on screen
  if (supportsIO) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) startAuto(); else stopAuto();
    }, { threshold: 0.3 }).observe(carousel);
  } else {
    startAuto();
  }

  /* ---------- 12. FAQ ACCORDION ---------- */
  $$('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = btn.getAttribute('aria-expanded') !== 'true';
      // Close the others so only one answer is open at a time
      $$('.faq__item.is-open').forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        $('.faq__q', other).setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- 13. QUOTE FORM ---------- */
  var form = $('#quote-form');
  var success = $('#quote-success');
  var statusEl = $('#form-status');
  var submitLabel = $('#quote-submit .btn__label');

  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your full name.'; },
    phone: function (v) {
      // Accepts PH mobile/landline formats like 0917 123 4567, +63 917 123 4567, (043) 555 0198
      var digits = v.replace(/[^\d]/g, '');
      return (digits.length >= 10 && digits.length <= 13) || 'Please enter a valid phone number (e.g. 0917 123 4567).';
    },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
    project_type: function (v) { return v !== '' || 'Please choose a project type.'; },
    location: function (v) { return v.trim().length >= 3 || 'Please tell us where the project is.'; },
    budget: function (v) { return v !== '' || 'Please choose a budget range.'; },
    message: function (v) { return v.trim().length >= 10 || 'Please add a few details (at least 10 characters).'; }
  };

  function validateField(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var result = rule(field.value);
    var wrap = field.closest('.field');
    var err = $('.field__error', wrap);
    var ok = result === true;
    wrap.classList.toggle('has-error', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    err.textContent = ok ? '' : result;
    return ok;
  }

  // Validate as the user leaves each field, and re-check while fixing an error
  Object.keys(rules).forEach(function (name) {
    var field = form.elements[name];
    field.addEventListener('blur', function () { if (field.value) validateField(field); });
    field.addEventListener('input', function () {
      if (field.closest('.field').classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.textContent = '';

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var field = form.elements[name];
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    form.classList.add('is-sending');
    submitLabel.textContent = 'Sending…';

    // Demo mode: if the Formspree ID hasn't been set yet, just show the success message.
    var demoMode = form.action.indexOf('YOUR_FORM_ID') !== -1;
    var request = demoMode
      ? new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true }); }, 700); })
      : fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });

    request.then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }).catch(function () {
      statusEl.textContent = 'Sorry, something went wrong. Please try again or call us at +63 917 555 0142.';
    }).then(function () {
      form.classList.remove('is-sending');
      submitLabel.textContent = 'Send My Quote Request';
    });
  });

  $('#quote-reset').addEventListener('click', function () {
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  /* ---------- 14. FOOTER YEAR ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
