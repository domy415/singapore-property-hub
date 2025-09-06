// public/js/remove-blocking-overlay.js  (TEMP debugging)
(function(){
  try {
    const art = document.querySelector('.article-page .article-body') || document.querySelector('article');
    if (!art) return;
    const rect = art.getBoundingClientRect();
    const el = document.elementFromPoint(Math.floor(window.innerWidth/2), Math.floor(rect.top + 8));
    if (el && !art.contains(el)) {
      // demote blocking element
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
      el.classList.add('__overlay-disabled-temp');
      console.log('[overlay-fix] demoted element:', el);
    }
    // hide pseudo-elements by class on hero if present
    const hero = document.querySelector('.article-hero');
    if (hero) hero.classList.add('__hero-pseudo-hidden-temp');
  } catch (e) { console.warn('overlay-fix error', e); }
})();