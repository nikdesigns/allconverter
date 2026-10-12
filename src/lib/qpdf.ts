"use client";

/**
 * PDF encryption and decryption with QPDF, the reference open-source PDF
 * transformation tool, compiled to WebAssembly. Everything runs in the
 * browser, in /workers/qpdf-worker.js; the engine is served from /vendor/qpdf/
 * (copied there by scripts/copy-vendor.mjs).
 */

export class WrongPasswordError extends Error {
  constructor() { super("That password is not correct for this PDF."); }
}

interface Reply { id: number; code: number; messages: string[]; output: ArrayBuffer | null }

let nextId = 1;

function runQpdf(args: string[], input: Uint8Array): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/workers/qpdf-worker.js");
    const id = nextId++;
    const finish = (fn: () => void) => { worker.terminate(); fn(); };
    worker.onerror = () => finish(() => reject(new Error("The PDF engine could not be loaded. Check your connection and try again.")));
    worker.onmessage = (event: MessageEvent<Reply>) => {
      const { code, messages, output } = event.data;
      if (event.data.id !== id) return;
      const text = messages.join("\n");
      finish(() => {
        if (/invalid password/i.test(text)) { reject(new WrongPasswordError()); return; }
        // 0 = success, 3 = success with warnings. Anything else produced no usable file.
        if ((code !== 0 && code !== 3) || !output) {
          const last = messages.filter(Boolean).pop()?.replace(/^[^:]*:\s*(\/in\.pdf:?\s*)?/, "");
          reject(new Error(last || "The PDF could not be processed."));
          return;
        }
        resolve(new Uint8Array(output));
      });
    };
    const copy = input.slice().buffer;
    worker.postMessage({ id, args, input: copy }, [copy]);
  });
}

/** Encrypt with AES-256. Opening the file then requires `password`. */
export function encryptPdf(pdf: Uint8Array, password: string): Promise<Uint8Array> {
  // User and owner password are the same: there is no second secret that could unlock the file.
  return runQpdf(["/in.pdf", "--encrypt", password, password, "256", "--", "/out.pdf"], pdf);
}

/** Remove encryption. `password` may be empty for PDFs that only restrict printing or copying. */
export function decryptPdf(pdf: Uint8Array, password: string): Promise<Uint8Array> {
  return runQpdf([`--password=${password}`, "--decrypt", "/in.pdf", "/out.pdf"], pdf);
}
