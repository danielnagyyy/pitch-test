declare module 'pitch-shift' {
    export default function pitchShift(
        onData: any,
        onTune: any,
        options: any,
    ): (channelData: Float32Array) => Float32Array;
}
declare module 'node-wav' {
    export function decode(buffer: Buffer): { sampleRate: number; channelData: Float32Array[] };
    export function encode(channelData: any, opts: any): Buffer;
}
