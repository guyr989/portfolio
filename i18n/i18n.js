(function () {
  var SUPPORTED = ['he', 'en'];
  var currentLang = 'he';

  function lookup(key) {
    var obj = window.__i18n && window.__i18n[currentLang];
    if (!obj) return null;
    var parts = key.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (obj == null || typeof obj !== 'object') return null;
      obj = obj[parts[i]];
    }
    return typeof obj === 'string' ? obj : null;
  }

  function applyLang(lang) {
    currentLang = SUPPORTED.indexOf(lang) !== -1 ? lang : 'he';
    var isRTL = currentLang === 'he';

    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Text content
    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
      var val = lookup(textEls[i].getAttribute('data-i18n'));
      if (val !== null) textEls[i].textContent = val;
    }

    // aria-label
    var ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaEls.length; j++) {
      var aval = lookup(ariaEls[j].getAttribute('data-i18n-aria'));
      if (aval !== null) ariaEls[j].setAttribute('aria-label', aval);
    }

    // data-open-label / data-close-label (for nav toggle)
    var openEls = document.querySelectorAll('[data-i18n-open]');
    for (var k = 0; k < openEls.length; k++) {
      var oval = lookup(openEls[k].getAttribute('data-i18n-open'));
      if (oval !== null) openEls[k].setAttribute('data-open-label', oval);
    }
    var closeEls = document.querySelectorAll('[data-i18n-close]');
    for (var l = 0; l < closeEls.length; l++) {
      var cval = lookup(closeEls[l].getAttribute('data-i18n-close'));
      if (cval !== null) closeEls[l].setAttribute('data-close-label', cval);
    }

    // Active state on language buttons
    var langBtns = document.querySelectorAll('.lang-btn');
    for (var m = 0; m < langBtns.length; m++) {
      var isActive = langBtns[m].getAttribute('data-lang') === currentLang;
      if (isActive) {
        langBtns[m].classList.add('active');
      } else {
        langBtns[m].classList.remove('active');
      }
    }

    localStorage.setItem('lang', currentLang);
  }

  // Expose for inline scripts that need to read current translations
  window.__t = lookup;

  // Apply initial language
  var stored = localStorage.getItem('lang');
  applyLang(SUPPORTED.indexOf(stored) !== -1 ? stored : 'he');

  // Language switcher clicks
  document.addEventListener('click', function (e) {
    var target = e.target;
    // Walk up in case the click lands on a child element
    while (target && target !== document) {
      if (target.classList && target.classList.contains('lang-btn')) {
        var lang = target.getAttribute('data-lang');
        if (lang) applyLang(lang);
        return;
      }
      target = target.parentNode;
    }
  });
})();
