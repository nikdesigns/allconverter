// Minimal typings for the MP3 encoder so the project type-checks the same way
// whether or not the package ships its own declarations.
declare module "@breezystack/lamejs" {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Uint8Array;
    flush(): Uint8Array;
  }
}
