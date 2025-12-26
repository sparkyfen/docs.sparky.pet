// Namevar system for customizing names and pronouns throughout the documentation
(function() {
  'use strict';

  // Define the namevars configuration
  const namevars = {
    identifier: {
      options: ['Sparky', 'Adam'],
      default: 'Sparky'
    }
  };

  // Define presets
  const presets = {
    default: {
      identifier: 'Sparky'
    },
    professional: {
      identifier: 'Adam'
    }
  };

  // Pronouns are always he/him/his
  const pronouns = {
    subject: 'he',
    object: 'him',
    possessive: 'his'
  };

  // Get stored value or default
  function getNamevar(name) {
    const key = `namevar-${name}`;
    const stored = localStorage.getItem(key);
    return stored || namevars[name].default;
  }

  // Set namevar value
  function setNamevar(name, value) {
    const key = `namevar-${name}`;
    localStorage.setItem(key, value);
    // Reload page to reprocess content
    location.reload();
  }

  // Apply namevar replacements to the page
  function applyNamevars() {
    // Update preview
    updatePreview();
  }

  // Update the preview box
  function updatePreview() {
    const identifier = getNamevar('identifier');

    const preview = document.querySelector('.namevar-preview');
    if (preview) {
      preview.innerHTML = `<strong>His</strong> name is <strong>${identifier}</strong>, and <strong>he</strong> goes by <strong>he/him</strong> pronouns.`;
    }
  }

  // Bind preset buttons
  function bindPresets() {
    document.querySelectorAll('#presets input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          const presetName = this.value;
          const preset = presets[presetName];
          if (preset) {
            Object.keys(preset).forEach(key => {
              setNamevar(key, preset[key]);
            });
            updateInputs();
          }
        }
      });

      // Set initial checked state
      const presetName = radio.value;
      const preset = presets[presetName];
      if (preset) {
        const matches = Object.keys(preset).every(key =>
          getNamevar(key) === preset[key]
        );
        radio.checked = matches;
      }
    });
  }

  // Bind namevar inputs
  function bindInputs() {
    // Text input for identifier
    const identifierInput = document.querySelector('[data-namevar-for="identifier"]');
    if (identifierInput) {
      identifierInput.value = getNamevar('identifier');

      // Only update when user is done typing (on blur or Enter key)
      identifierInput.addEventListener('blur', function() {
        if (this.value !== getNamevar('identifier')) {
          setNamevar('identifier', this.value);
        }
      });

      identifierInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          this.blur(); // Trigger blur event
        }
      });
    }

    // Revert button
    document.querySelectorAll('[data-namevar-revert]').forEach(btn => {
      btn.addEventListener('click', function() {
        const varName = this.getAttribute('data-namevar-revert');
        if (namevars[varName]) {
          setNamevar(varName, namevars[varName].default);
          updateInputs();
        }
      });
    });
  }

  // Update input values from storage
  function updateInputs() {
    const identifierInput = document.querySelector('[data-namevar-for="identifier"]');
    if (identifierInput) {
      identifierInput.value = getNamevar('identifier');
    }
  }

  // Process text content to replace [variable] syntax
  function processContent() {
    const identifier = getNamevar('identifier');

    // Find all text nodes in the main content
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;

    // Process all text nodes
    const walker = document.createTreeWalker(
      contentArea,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const nodesToProcess = [];
    let node;
    while (node = walker.nextNode()) {
      // Skip script and style elements
      if (node.parentElement.tagName === 'SCRIPT' ||
          node.parentElement.tagName === 'STYLE' ||
          node.parentElement.closest('code')) {
        continue;
      }

      if (node.textContent.includes('[')) {
        nodesToProcess.push(node);
      }
    }

    // Process the nodes
    nodesToProcess.forEach(textNode => {
      const text = textNode.textContent;

      // Replace patterns: [identifier] and pronouns (always he/him/his)
      let newHTML = text
        .replace(/\[([^\]]+)\]/g, (match, content) => {
          const lower = content.toLowerCase();
          let replacement = '';
          let isCapitalized = content[0] === content[0].toUpperCase();

          // Check what this variable is
          if (lower === 'sparky' || lower === 'adam') {
            replacement = identifier;
          } else if (lower === 'he') {
            replacement = 'he';
          } else if (lower === 'him') {
            replacement = 'him';
          } else if (lower === 'his') {
            replacement = 'his';
          } else if (lower === 'himself') {
            replacement = 'himself';
          } else {
            // Unknown variable, keep as is
            return match;
          }

          // Preserve capitalization
          if (isCapitalized && replacement) {
            replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
          }

          return replacement;
        });

      // Only update if something changed
      if (newHTML !== text) {
        const span = document.createElement('span');
        span.innerHTML = newHTML;
        textNode.replaceWith(span);
      }
    });
  }

  // Initialize
  function init() {
    processContent();
    bindPresets();
    bindInputs();
    applyNamevars();

    // Remove require-javascript class
    document.querySelectorAll('.require-javascript').forEach(el => {
      el.classList.remove('require-javascript');
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
