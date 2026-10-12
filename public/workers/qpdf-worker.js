/* Runs QPDF (WebAssembly) off the main thread for PDF encryption and decryption.
   Plain script on purpose: QPDF's loader contains Node-only code that the
   bundler cannot process, so it is loaded straight from /vendor/qpdf/. */
const BASE = self.location.origin + "/vendor/qpdf/";
importScripts(BASE + "qpdf.js"); // defines the global factory `Module`

self.onmessage = async (event) => {
  const { id, args, input } = event.data || {};
  const messages = [];
  // QPDF writes its errors with console.error; collect them for the page.
  const original = { log: console.log, error: console.error, warn: console.warn };
  console.log = console.error = console.warn = (...parts) => { messages.push(parts.join(" ")); };
  try {
    // A fresh instance per job: QPDF's command-line entry point is not meant to run twice.
    const qpdf = await self.Module({
      locateFile: () => BASE + "qpdf.wasm",
      noInitialRun: true,
      print: (text) => messages.push(String(text)),
      printErr: (text) => messages.push(String(text)),
    });
    qpdf.FS.writeFile("/in.pdf", new Uint8Array(input));
    let code = 0;
    try {
      const returned = qpdf.callMain(args);
      code = typeof returned === "number" ? returned : 0;
    } catch (e) {
      code = e && typeof e.status === "number" ? e.status : 2; // non-zero exit arrives as a thrown ExitStatus
    }
    let output = null;
    try { output = qpdf.FS.readFile("/out.pdf"); } catch (e) { /* no output written */ }
    const buffer = output ? output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) : null;
    self.postMessage({ id, code, messages, output: buffer }, buffer ? [buffer] : []);
  } catch (error) {
    self.postMessage({ id, code: 2, messages: messages.concat(String((error && error.message) || error)), output: null });
  } finally {
    console.log = original.log; console.error = original.error; console.warn = original.warn;
  }
};
