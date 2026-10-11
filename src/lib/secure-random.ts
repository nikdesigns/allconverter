/**
 * Uniform random integer in [0, max) from the browser's cryptographic RNG.
 * Use this, not Math.random(), for anything that becomes a secret
 * (passwords, passphrases, tokens). Rejection sampling avoids modulo bias.
 */
export function secureRandomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) throw new RangeError("max must be a positive integer");
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let value = 0;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}
