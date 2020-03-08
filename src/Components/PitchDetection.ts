import * as Utils from "../lib/Core/Utils";
import { Pitch } from '../lib/TheoryLib/Pitch';
import { precondition } from '../lib/Core/Dbc';

export const concertAHz = 440;
export const concertAMidiNumber = 69;

export interface IPitchDetector {
	detectPitch(sampleBuffer: Float32Array, sampleRate: number): DetectedPitch | null;
}

// Based on https://github.com/dalatant/PitchDetect
export class DatalantPitchDetector implements IPitchDetector {
	public detectPitch(sampleBuffer: Float32Array, sampleRate: number): DetectedPitch | null {
		const ac = autoCorrelate(sampleBuffer, sampleRate);
		
		const isConfident = !isNaN(ac) && (ac !== -1);
	
		if (isConfident) {
			const pitch = ac;
			const midiNumber = noteFromPitch(pitch);
			const detuneCents = centsOffFromPitch(pitch, midiNumber);
	
			return new DetectedPitch(Pitch.createFromMidiNumber(midiNumber), detuneCents);
		} else {
			return null;
		}
	}
}

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency: number): number {
	precondition(!isNaN(frequency));
	const noteNum = 12 * (Math.log(frequency / concertAHz) / Math.log(2));
	return Math.round(noteNum) + concertAMidiNumber;
}

function frequencyFromNoteNumber(note: number): number {
	return concertAHz * Math.pow(2, (note - concertAMidiNumber) / 12);
}

function centsOffFromPitch(frequency: number, note: number): number {
	return Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
}

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
	// Implements the ACF2+ algorithm
	let SIZE = buf.length;
	let rms = 0;

	for (let i=0;i<SIZE;i++) {
		const val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	let r1=0, r2=SIZE-1, thres=0.2;
	for (let i=0; i<SIZE/2; i++)
		if (Math.abs(buf[i])<thres) { r1=i; break; }
	for (let i=1; i<SIZE/2; i++)
		if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

	buf = buf.slice(r1,r2);
	SIZE = buf.length;

	const c = new Array(SIZE).fill(0);
	for (let i=0; i<SIZE; i++)
		for (let j=0; j<SIZE-i; j++)
			c[i] = c[i] + buf[j]*buf[j+i];

  let d=0; while (c[d]>c[d+1]) d++;
	let maxval=-1, maxpos=-1;
	for (let i=d; i<SIZE; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}
	let T0 = maxpos;

	const x1=c[T0-1], x2=c[T0], x3=c[T0+1];
	const a = (x1 + x3 - 2*x2)/2;
	const b = (x3 - x1)/2;
	if (a) T0 = T0 - b/(2*a);

	return sampleRate / T0;
}

export class DetectedPitch {
  public constructor(
    public pitch: Pitch,
    public detuneCents: number
  ) {}
}