import pitchShift from 'pitch-shift';

import fs from 'fs';
import wav from 'node-wav';

import { PitchShift } from 'tone';

function modifyVolume(channelData: Float32Array[], volume: number) {
    if (volume < 0) {
        throw new Error('Volume cannot be negative');
    }
    return channelData.map(data => data.map(x => x * volume));
}

function changePitch(soundData: Float32Array[], pitch: number, sampleRate: number): Float32Array[] {
    let channelIndex = 0;
    const frameSize = 1024;
    const numberOfChannels = soundData.length;
    const resultData = new Array<Float32Array>(numberOfChannels);

    while (channelIndex < numberOfChannels) {
        const channelData = soundData[channelIndex];
        const shiftedData = new Float32Array(channelData.length);
        let dataStartIndex = 0;

        const shifter = pitchShift(
            (data: Float32Array) => {
                shiftedData.set(data, dataStartIndex);
                dataStartIndex += data.length;
            },
            (a: any, b: any) => pitch,
            {
                frameSize: frameSize,
                threshold: 1,
            },
        );
        let frameIndex = 0;
        while (frameIndex + frameSize < channelData.length) {
            shifter(channelData.slice(frameIndex, frameIndex + frameSize));
            frameIndex += frameSize;
        }
        resultData[channelIndex] = shiftedData;
        channelIndex++;
    }
    return resultData;
}

function changeSpeed(soundData: Float32Array[], speed: number): Float32Array[] {
    if (speed === 1) {
        return soundData;
    }
    let channelIndex = 0;
    const numberOfChannels = soundData.length;
    const resultData = new Array<Float32Array>(numberOfChannels);

    const otherWeight = 1 - speed;

    while (channelIndex < numberOfChannels) {
        const channelData = soundData[channelIndex];
        const channelDataLength = channelData.length;
        const modifiedChannelData = new Array<number>();

        let dataIndex = 0;
        let newElementIndex = dataIndex * speed;
        while (newElementIndex + 1 < channelDataLength) {
            const firstDataIndex = Math.floor(newElementIndex);
            const secondDataIndex = Math.ceil(newElementIndex);

            const modifiedData =
                (channelData[firstDataIndex] * speed + channelData[secondDataIndex] * otherWeight) /
                2;

            modifiedChannelData.push(modifiedData);
            dataIndex++;
            newElementIndex = dataIndex * speed;
        }
        resultData[channelIndex] = new Float32Array(modifiedChannelData);

        channelIndex++;
    }
    return resultData;
}

function saveDataToFile(path: string, data: Buffer) {
    fs.writeFileSync(path, data);
}

function encodeToWav(data: Float32Array[], sampleRate: number) {
    return wav.encode(data, {
        sampleRate: sampleRate,
        float: true,
        bitDepth: 16,
    });
}

describe('Pitch shifting solutions', () => {
    it('pitch-shift & node-wav', () => {
        const directoryPath = '/Users/danielnagy/pitch_processing_test/src/__tests__';
        const resultsDirectory = '/results';
        const originalFileName = { a: 'beszed.wav', b: 'original.wav', c: 'lala.wav' }.c;

        let buffer = fs.readFileSync(`${directoryPath}/${originalFileName}`);
        console.time('a');
        let result = wav.decode(buffer);

        // const channelDataWithModifiedVolume = modifyVolume(result.channelData, 5);
        // const channelDataWithIncreasedSpeed = changeSpeed(result.channelData, 1.1);
        // const channelDataWithDecreasedSpeed = changeSpeed(result.channelData, 0.9);

        const channelDataWithChangedPitch = changePitch(result.channelData, 0.7, result.sampleRate);

        // const modifiedVolumeBuffer = encodeToWav(channelDataWithModifiedVolume, result.sampleRate);
        // const increasedSpeed = encodeToWav(channelDataWithIncreasedSpeed, result.sampleRate);
        // const decreasedSpeed = encodeToWav(channelDataWithDecreasedSpeed, result.sampleRate);
        const pitchChanged = encodeToWav(channelDataWithChangedPitch, result.sampleRate);
        // saveDataToFile(
        //     `${directoryPath}${resultsDirectory}/volumeChange.wav`,
        //     modifiedVolumeBuffer,
        // );
        // saveDataToFile(`${directoryPath}${resultsDirectory}/increasedSpeed.wav`, increasedSpeed);
        // saveDataToFile(`${directoryPath}${resultsDirectory}/decreasedSpeed.wav`, decreasedSpeed);
        saveDataToFile(`${directoryPath}${resultsDirectory}/pitchChanged.wav`, pitchChanged);
        console.timeEnd('a');
    });

    it('Tone.js', () => {
        // Tone;
    });
});
