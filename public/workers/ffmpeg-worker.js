/* Runs FFmpeg (WebAssembly) off the main thread.
   Loads the single-threaded @ffmpeg/core build that scripts/copy-vendor.mjs
   places in /vendor/ffmpeg/. Plain script on purpose: it never goes through
   the bundler, which is where ffmpeg.wasm setups usually break. */
const BASE = self.location.origin + "/vendor/ffmpeg/";
let core = null;
let loading = null;

function load() {
  if (core) return Promise.resolve(core);
  if (!loading) {
    loading = (async () => {
      importScripts(BASE + "ffmpeg-core.js");
      // The core reads the wasm location from the URL fragment.
      const hint = btoa(JSON.stringify({ wasmURL: BASE + "ffmpeg-core.wasm", workerURL: "" }));
      const mod = await self.createFFmpegCore({ mainScriptUrlOrBlob: BASE + "ffmpeg-core.js#" + hint });
      mod.setLogger((entry) => self.postMessage({ type: "log", message: entry && entry.message }));
      mod.setProgress((entry) => self.postMessage({ type: "progress", progress: entry && entry.progress, time: entry && entry.time }));
      core = mod;
      return mod;
    })().catch((error) => { loading = null; throw error; });
  }
  return loading;
}

self.onmessage = async (event) => {
  const { id, type, inputs = [], args = [], outputs = [] } = event.data || {};
  if (type !== "run") return;
  const written = [];
  try {
    const ff = await load();
    self.postMessage({ type: "ready" });
    for (const input of inputs) {
      ff.FS.writeFile(input.name, new Uint8Array(input.data));
      written.push(input.name);
    }
    ff.setTimeout(-1);
    const returned = ff.exec(...args);
    const code = typeof ff.ret === "number" ? ff.ret : returned;
    ff.reset();

    const results = [];
    const transfer = [];
    for (const name of outputs) {
      try {
        const data = ff.FS.readFile(name);
        results.push({ name, data: data.buffer });
        transfer.push(data.buffer);
        ff.FS.unlink(name);
      } catch (e) { /* the command did not produce this file */ }
    }
    self.postMessage({ type: "done", id, code, outputs: results }, transfer);
  } catch (error) {
    self.postMessage({ type: "error", id, message: String((error && error.message) || error) });
  } finally {
    if (core) for (const name of written) { try { core.FS.unlink(name); } catch (e) { /* already gone */ } }
  }
};
