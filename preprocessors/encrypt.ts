#!/usr/bin/env -S deno run -A
import { Context, preprocess } from "../lib/mdbook-preprocessor.ts";
import { encrypt } from "../lib/encryption.ts";
import { loadKey } from "../lib/encryptionkey.ts";
import { sopsDecrypt } from "../lib/sops.ts";
import { chapters } from "../lib/mdbook.ts";

const encryptedRe = /{{#encrypted +([^/\0]+)}}/gm;
const encryptionKey = await loadKey();

async function loadEncryptedContent(
  context: Context,
  name: string,
): Promise<string> {
  const encryptedDir = context.root + "/src/encrypted";
  const path = encryptedDir + "/" + name;

  // Perform SOPS decryption to convert from version controlled encryption to
  // plain text.
  let content = await sopsDecrypt(path).catch((e) => {
    console.warn(`Failed to decrypt ${path}:`, e);
    return `<div class="admonish-error"><b>SOPS error:</b> content unable to be decrypted.</div>`;
  });

  const [_, ext] = name.split(".");
  switch (ext) {
    case "":
    case "txt": {
      content = `<pre>${content}</pre>`;
      break;
    }
    case "html": {
      // ok
      break;
    }
    case "md": {
      // For now, keep markdown as-is
      // In the future, we can add markdown processing here
      content = `<div class="encrypted-markdown">${content}</div>`;
      break;
    }
    default: {
      throw new Error(`Unsupported file extension: ${ext}`);
    }
  }

  // Re-encrypt the content, this time for rendering instead of for version
  // control.
  content = await encrypt(encryptionKey, content);
  return content;
}

await preprocess(async (context, book) => {
  const names = new Set<string>();
  for (const chapter of chapters(book)) {
    for (const match of chapter.content.matchAll(encryptedRe)) {
      names.add(match[1]);
    }
  }

  const contents = (
    await Promise.all(
      Array.from(names).map((name) =>
        loadEncryptedContent(context, name).then((content) => ({
          name,
          content,
        })),
      ),
    )
  ).reduce((map, { name, content }) => {
    map.set(name, content);
    return map;
  }, new Map<string, string>());

  for (const chapter of chapters(book)) {
    chapter.content = chapter.content.replaceAll(encryptedRe, (_, key) => {
      return contents.get(key)!;
    });
  }
});
