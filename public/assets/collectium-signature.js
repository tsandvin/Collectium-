/*
  Collectium global signature helper
  Version: signature-lock-2026-05-22

  Adds the locked Collectium signature only where missing.
  Safe to include in the global template footer after the DOM is available.
*/
(function () {
  'use strict';

  function createPanelSignature() {
    var wrap = document.createElement('span');
    wrap.className = 'ct-signature';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<span class="ct-signature__word">Collectium</span><span class="ct-signature__corner"></span><span class="ct-signature__rise"></span>';
    return wrap;
  }

  function createSearchSignature() {
    var wrap = document.createElement('span');
    wrap.className = 'ct-edge-signature';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<span class="ct-edge-signature__word">Collectium</span>';
    return wrap;
  }

  function attachStandardSignatures(root) {
    var scope = root || document;
    var selector = '.ct-panel, .ct-card, .ct-field-box, .ct-large-switch, .ct-signature-frame';
    scope.querySelectorAll(selector).forEach(function (node) {
      if (!node.querySelector(':scope > .ct-signature')) {
        node.appendChild(createPanelSignature());
      }
    });
  }

  function attachSearchSignatures(root) {
    var scope = root || document;
    var selector = '.ct-search-signature-lock, .search.ct-search-signature-lock, .ct-search';
    scope.querySelectorAll(selector).forEach(function (node) {
      node.classList.add('ct-search-signature-lock');
      if (!node.querySelector(':scope > .ct-edge-signature')) {
        node.appendChild(createSearchSignature());
      }
    });
  }

  function initCollectiumSignatures(root) {
    attachStandardSignatures(root);
    attachSearchSignatures(root);
  }

  window.ctInitCollectiumSignatures = initCollectiumSignatures;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCollectiumSignatures(document);
    });
  } else {
    initCollectiumSignatures(document);
  }
})();
