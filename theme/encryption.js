// Encryption/decryption system for browser
(function() {
  'use strict';

  // Utility functions
  function encodeBase64(raw) {
    const u8buf = raw instanceof ArrayBuffer ? new Uint8Array(raw) : raw;
    return btoa(String.fromCharCode(...u8buf));
  }

  function decodeBase64(str) {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  }

  async function keyFingerprint(key) {
    if (!key.extractable) {
      throw new Error("Key is not extractable");
    }

    const raw = await crypto.subtle.exportKey("raw", key);
    const hash = await crypto.subtle.digest("SHA-256", raw);
    const hash6 = new Uint8Array(hash).slice(0, 6);

    return [...new Uint8Array(hash6)]
      .map((x) => x.toString(16).padStart(2, "0").toUpperCase())
      .join(":");
  }

  async function decrypt(key, iv, data) {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: decodeBase64(iv) },
      key,
      decodeBase64(data),
    );
    return new TextDecoder().decode(decrypted);
  }

  // HTML templates
  const encryptedNotification = `
    <p class="encrypted-notification">
      This content is encrypted. More information can be found under <a href="../reference/tagging-encryption.html">Tagging and Encryption</a>.
    </p>
  `;

  const incorrectKeyNotification = `
    <div class="admonition admonish-warning" role="note">
      <div class="admonition-title">
        <p>Encrypted content cannot be decrypted</p>
      </div>
      <div>
        <p>
          You may have provided an incorrect decryption key or the content has
          been tampered with.
        </p>
      </div>
    </div>
  `;

  // Custom element for encrypted content
  class EncryptedHTMLElement extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const url = new URL(location.href);

      let keyStr = url.searchParams.get("key");
      if (keyStr) {
        sessionStorage.setItem("encryption-key", keyStr);
      } else {
        keyStr = sessionStorage.getItem("encryption-key");
        if (!keyStr) {
          this.notifyEncrypted();
          return;
        }
      }

      const iv = this.getAttribute("iv");
      const fp = this.getAttribute("fp");
      const data = this.getAttribute("data");
      if (!iv || !fp || !data) {
        console.error("Invalid html-encrypted element");
        return;
      }

      (async () => {
        const key = await crypto.subtle.importKey(
          "raw",
          decodeBase64(keyStr),
          "AES-GCM",
          true,
          ["decrypt"],
        );

        const keyFp = await keyFingerprint(key);
        if (keyFp !== fp) {
          throw new Error("Key fingerprint mismatch");
        }

        const content = document.createElement("div");
        content.innerHTML = await decrypt(key, iv, data);
        content.classList.add("decrypted-content");

        this.replaceChildren(content);
        console.debug("Decrypted element", this);
      })().catch((err) => {
        console.error("Failed to decrypt element", err);
        this.notifyIncorrectKey();
      });
    }

    notifyEncrypted() {
      this.innerHTML = encryptedNotification;
    }

    notifyIncorrectKey() {
      this.innerHTML = incorrectKeyNotification;
    }
  }

  // Initialize
  function init() {
    customElements.define("html-encrypted", EncryptedHTMLElement);
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
