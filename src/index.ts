import pitchShift from 'pitch-shift';

console.log(pitchShift);
var context
if (typeof AudioContext !== "undefined") {
  context = new AudioContext();
} else {
  throw new Error("No WebAudio!")
}