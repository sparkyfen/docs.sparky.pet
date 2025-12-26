#!/usr/bin/env -S deno run -A

import { rotateKey } from "../lib/encryptionkey.ts";

console.log("Generating new encryption key...");
await rotateKey();
console.log("Encryption key generated and saved to src/encrypted/encryption-key.json");
