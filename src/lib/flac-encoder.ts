/**
 * Minimal FLAC encoder (16-bit, mono or stereo) written for the browser.
 *
 * It uses FLAC's fixed linear predictors (orders 0-4) with Rice-coded
 * residuals, which is the "fast" end of what reference encoders do. Output is
 * a standard, fully lossless .flac stream that any decoder can read; files are
 * a little larger than `flac -8` would produce, typically 50-70% of the WAV.
 */

const BLOCK_SIZE = 4096;
const BITS_PER_SAMPLE = 16;

class BitWriter {
  private buf = new Uint8Array(1 << 16);
  private pos = 0; // bytes fully or partly written
  private acc = 0; // pending bits (left-aligned in the low `fill` bits)
  private fill = 0;

  private ensure(extra: number) {
    if (this.pos + extra <= this.buf.length) return;
    const next = new Uint8Array(Math.max(this.buf.length * 2, this.pos + extra));
    next.set(this.buf.subarray(0, this.pos));
    this.buf = next;
  }

  /** Write the low `count` bits of `value` (count <= 24). */
  write(value: number, count: number) {
    if (count === 0) return;
    this.acc = (this.acc << count) | (value & ((1 << count) - 1));
    this.fill += count;
    this.ensure(4);
    while (this.fill >= 8) {
      this.fill -= 8;
      this.buf[this.pos++] = (this.acc >>> this.fill) & 0xff;
    }
    this.acc &= (1 << this.fill) - 1;
  }

  /** Write a value of up to 32 bits. */
  writeWide(value: number, count: number) {
    if (count > 16) {
      this.write(value >>> 16, count - 16);
      this.write(value & 0xffff, 16);
    } else {
      this.write(value, count);
    }
  }

  /** `zeros` zero bits followed by a one bit. */
  writeUnary(zeros: number) {
    while (zeros >= 16) { this.write(0, 16); zeros -= 16; }
    this.write(1, zeros + 1);
  }

  align() {
    if (this.fill > 0) this.write(0, 8 - this.fill);
  }

  get length() { return this.pos; }
  bytes(): Uint8Array { return this.buf.subarray(0, this.pos); }
}

const CRC8_TABLE = (() => {
  const t = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let b = 0; b < 8; b++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
    t[i] = c;
  }
  return t;
})();

const CRC16_TABLE = (() => {
  const t = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i << 8;
    for (let b = 0; b < 8; b++) c = c & 0x8000 ? ((c << 1) ^ 0x8005) & 0xffff : (c << 1) & 0xffff;
    t[i] = c;
  }
  return t;
})();

function crc8(data: Uint8Array): number {
  let c = 0;
  for (let i = 0; i < data.length; i++) c = CRC8_TABLE[c ^ data[i]];
  return c;
}

function crc16(data: Uint8Array): number {
  let c = 0;
  for (let i = 0; i < data.length; i++) c = ((c << 8) & 0xffff) ^ CRC16_TABLE[(c >>> 8) ^ data[i]];
  return c;
}

/** FLAC's "UTF-8-like" coding of the frame number. */
function utf8Number(n: number): number[] {
  if (n < 0x80) return [n];
  const out: number[] = [];
  let bytes = 2;
  while (bytes < 6 && n >= 1 << (5 * bytes + 1)) bytes++;
  const lead = (0xff << (8 - bytes)) & 0xff;
  out.push(lead | (n >>> (6 * (bytes - 1))));
  for (let i = bytes - 2; i >= 0; i--) out.push(0x80 | ((n >>> (6 * i)) & 0x3f));
  return out;
}

const residual = new Int32Array(BLOCK_SIZE);

/** Fill `residual` for the given predictor order; returns the sum of |residual|. */
function computeResidual(s: Int16Array, start: number, n: number, order: number): number {
  let sum = 0;
  for (let i = order; i < n; i++) {
    const p = start + i;
    let r: number;
    switch (order) {
      case 0: r = s[p]; break;
      case 1: r = s[p] - s[p - 1]; break;
      case 2: r = s[p] - 2 * s[p - 1] + s[p - 2]; break;
      case 3: r = s[p] - 3 * s[p - 1] + 3 * s[p - 2] - s[p - 3]; break;
      default: r = s[p] - 4 * s[p - 1] + 6 * s[p - 2] - 4 * s[p - 3] + s[p - 4];
    }
    residual[i] = r;
    sum += r < 0 ? -r : r;
  }
  return sum;
}

function riceBits(order: number, n: number, k: number): number {
  let bits = 0;
  for (let i = order; i < n; i++) {
    const r = residual[i];
    const u = r >= 0 ? r * 2 : -r * 2 - 1;
    bits += Math.floor(u / (1 << k)) + 1 + k;
  }
  return bits;
}

function writeSubframe(w: BitWriter, s: Int16Array, start: number, n: number) {
  // Constant block (digital silence and the like).
  let constant = true;
  for (let i = 1; i < n; i++) if (s[start + i] !== s[start]) { constant = false; break; }
  if (constant) {
    w.write(0b00000000, 8);
    w.write(s[start] & 0xffff, 16);
    return;
  }

  // Pick the fixed predictor with the smallest residual energy.
  let bestOrder = 0;
  let bestSum = Infinity;
  const maxOrder = Math.min(4, n - 1);
  for (let order = 0; order <= maxOrder; order++) {
    const sum = computeResidual(s, start, n, order);
    if (sum < bestSum) { bestSum = sum; bestOrder = order; }
  }
  const count = n - bestOrder;
  computeResidual(s, start, n, bestOrder);

  // Rice parameter: start from the mean magnitude and check its neighbours.
  const mean = bestSum / count;
  const guess = mean > 1 ? Math.min(14, Math.floor(Math.log2(mean)) + 1) : 0;
  let bestK = guess;
  let bestBits = Infinity;
  for (let k = Math.max(0, guess - 1); k <= Math.min(14, guess + 1); k++) {
    const bits = riceBits(bestOrder, n, k);
    if (bits < bestBits) { bestBits = bits; bestK = k; }
  }

  const fixedBits = bestOrder * BITS_PER_SAMPLE + 2 + 4 + 4 + bestBits;
  if (fixedBits >= n * BITS_PER_SAMPLE) {
    // Verbatim is smaller (noise-like audio).
    w.write(0b00000010, 8);
    for (let i = 0; i < n; i++) w.write(s[start + i] & 0xffff, 16);
    return;
  }

  w.write((0b001000 | bestOrder) << 1, 8); // pad 0, type 001ooo, no wasted bits
  for (let i = 0; i < bestOrder; i++) w.write(s[start + i] & 0xffff, 16);
  w.write(0b00, 2);  // Rice coding with 4-bit parameters
  w.write(0, 4);     // partition order 0: one partition
  w.write(bestK, 4);
  const mask = (1 << bestK) - 1;
  for (let i = bestOrder; i < n; i++) {
    const r = residual[i];
    const u = r >= 0 ? r * 2 : -r * 2 - 1;
    w.writeUnary(Math.floor(u / (1 << bestK)));
    if (bestK > 0) w.write(u & mask, bestK);
  }
}

/**
 * Encode 16-bit PCM to FLAC.
 * @param channels one Int16Array per channel (1 or 2), all the same length
 */
export function encodeFlac(channels: Int16Array[], sampleRate: number): Uint8Array {
  const numChannels = channels.length;
  if (numChannels < 1 || numChannels > 2) throw new Error("FLAC encoder supports mono or stereo audio.");
  if (sampleRate < 1 || sampleRate > 655350) throw new Error("Unsupported sample rate for FLAC.");
  const total = channels[0].length;

  const head = new BitWriter();
  head.write(0x66, 8); head.write(0x4c, 8); head.write(0x61, 8); head.write(0x43, 8); // "fLaC"
  head.write(1, 1);            // last metadata block
  head.write(0, 7);            // STREAMINFO
  head.write(34, 24);          // length
  head.write(BLOCK_SIZE, 16);  // min block size
  head.write(BLOCK_SIZE, 16);  // max block size
  head.write(0, 24);           // min frame size (unknown)
  head.write(0, 24);           // max frame size (unknown)
  head.writeWide(sampleRate, 20);
  head.write(numChannels - 1, 3);
  head.write(BITS_PER_SAMPLE - 1, 5);
  head.write(Math.floor(total / 0x100000000) & 0xf, 4); // total samples, high 4 bits
  head.writeWide(total >>> 0, 32);                       // total samples, low 32 bits
  for (let i = 0; i < 16; i++) head.write(0, 8);         // MD5 (zero = not computed)

  const parts: Uint8Array[] = [head.bytes().slice()];
  let size = parts[0].length;

  let frameNumber = 0;
  for (let start = 0; start < total; start += BLOCK_SIZE, frameNumber++) {
    const n = Math.min(BLOCK_SIZE, total - start);
    const w = new BitWriter();
    w.write(0xff, 8);
    w.write(0xf8, 8);                              // sync + fixed block size stream
    w.write(0b0111, 4);                            // block size: 16-bit value follows
    w.write(0b0000, 4);                            // sample rate: see STREAMINFO
    w.write(numChannels === 1 ? 0b0000 : 0b0001, 4); // independent channels
    w.write(0b100, 3);                             // 16 bits per sample
    w.write(0, 1);
    for (const b of utf8Number(frameNumber)) w.write(b, 8);
    w.write(n - 1, 16);
    w.write(crc8(w.bytes()), 8);

    for (let c = 0; c < numChannels; c++) writeSubframe(w, channels[c], start, n);

    w.align();
    w.write(crc16(w.bytes()), 16);
    const frame = w.bytes().slice();
    parts.push(frame);
    size += frame.length;
  }

  const out = new Uint8Array(size);
  let offset = 0;
  for (const p of parts) { out.set(p, offset); offset += p.length; }
  return out;
}
