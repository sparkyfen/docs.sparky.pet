# Tagging and Encryption

Some content in this documentation is encrypted for privacy and security. This page explains how the encryption system works.

## What is Encrypted?

Certain sensitive information, such as emergency contacts, medical information, and other private details, are encrypted to protect [Sparky]'s privacy.

## How Encryption Works

This documentation uses a two-layer encryption approach:

1. **Version Control Encryption (SOPS)**: Files are encrypted with [SOPS](https://github.com/getsops/sops) using [age](https://age-encryption.org/) encryption for secure storage in the git repository.

2. **Browser Encryption (AES-GCM)**: During the build process, the content is re-encrypted using AES-GCM encryption so it can be decrypted in your browser with the right key.

## How to Access Encrypted Content

To view encrypted content, you need the encryption key. If you've been given the key:

1. **URL Parameter**: Add `?key=YOUR_KEY_HERE` to the URL of any page
   - Example: `https://docs.sparky.pet/reference/emergency.html?key=YOUR_KEY_HERE`

2. **Session Storage**: Once you've accessed a page with the key parameter, it's stored in your browser's session storage and will work for all encrypted content during that session.

## Security Notes

- The encryption key is stored in your browser's session storage (not persisted across browser restarts)
- All decryption happens client-side in your browser
- The decryption key is never sent to any server
- If you don't have the key, you cannot access the encrypted content

## Getting Access

If you need access to encrypted content (such as in an emergency situation), please contact [Sparky] through available communication channels.
