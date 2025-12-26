import { generateKey } from "./encryption.ts";
import { sopsDecrypt, sopsEncryptTo } from "./sops.ts";

const keyPath =
  new URL("../src/encrypted/encryption-key.json", import.meta.url).pathname;

export async function saveKey(key: CryptoKey) {
  const raw = await crypto.subtle.exportKey("jwk", key);
  const json = JSON.stringify(raw);
  await sopsEncryptTo(keyPath, json);
}

export async function loadKey(): Promise<CryptoKey> {
  const json = await sopsDecrypt(keyPath);
  const raw = JSON.parse(json);
  const key = await crypto.subtle.importKey("jwk", raw, "AES-GCM", true, [
    "encrypt",
  ]);
  return key;
}

export async function rotateKey() {
  const key = await generateKey();
  await saveKey(key);
}
