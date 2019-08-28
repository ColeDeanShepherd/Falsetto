import { Howl } from "howler";

import { NumberDictionary } from "./NumberDictionary";

export function polyfillWebAudio() {
  const windowAny = window as any;
  windowAny.AudioContext = windowAny.AudioContext || windowAny.webkitAudioContext;
  
  const AudioContext = windowAny.AudioContext;
  if (AudioContext) {
    const prototype = AudioContext.prototype;
  
    if (!prototype.createScriptProcessor && prototype.createJavaScriptNode) {
      prototype.createScriptProcessor = prototype.createJavaScriptNode;
    }
  }

  const AnalyserNode = windowAny.AnalyserNode;
  if (AnalyserNode) {
    if (AnalyserNode.prototype.hasOwnProperty("getFloatTimeDomainData")) {
      return;
    }
  
    const scaleFactor = 0.0078125; // 1 / 128
    const uint8SampleBuffersBySize: NumberDictionary<Uint8Array> = {};
  
    AnalyserNode.prototype.getFloatTimeDomainData = function (this: AnalyserNode, sampleBuffer: Float32Array) {
      if (!uint8SampleBuffersBySize[sampleBuffer.length]) {
        uint8SampleBuffersBySize[sampleBuffer.length] = new Uint8Array(sampleBuffer.length);
      }

      const uint8SampleBuffer = uint8SampleBuffersBySize[sampleBuffer.length];
      this.getByteTimeDomainData(uint8SampleBuffer);

      for (let i = 0; i < sampleBuffer.length; i++) {
        sampleBuffer[i] = (uint8SampleBuffer[i] - 128) * scaleFactor;
      }
    };
  }
  
  const navigatorAny = navigator as any;
  navigatorAny.getUserMedia = navigatorAny.getUserMedia || navigatorAny.webkitGetUserMedia;
}

export function loadSoundAsync(soundFilePath: string): Promise<Howl> {
  return new Promise<Howl>((resolve, reject) => {
    new Howl({
      src: soundFilePath,
      onload: function(this: Howl) {
        resolve(this);
      },
      onloaderror: (soundId, error) => {
        reject(error);
      }
    });
  });
}
export function loadSoundsAsync(soundFilePaths: Array<string>): Promise<Array<Howl>> {
  return new Promise((resolve, reject) => {
    const soundCount = soundFilePaths.length;
    const loadedSounds = new Array<Howl>(soundCount);
    let loadedSoundCount = 0;

    soundFilePaths
      .map((filePath, i) => {
        return new Howl({
          src: filePath,
          onload: function(this: Howl) {
            loadedSounds[i] = this;
            loadedSoundCount++;
      
            if (loadedSoundCount === soundCount) {
              resolve(loadedSounds);
            }
          },
          onloaderror: (soundId, error) => {
            reject(error);
          }
        });
      });
  });
}

export function loadAndPlaySound(soundFilePath: string, volume: number = 1): Howl {
  const howl = new Howl({ src: soundFilePath, volume: volume });
  howl.play();

  return howl;
}
export function loadAndPlaySoundsSimultaneously(
  soundFilePaths: Array<string>
): [Promise<Array<Howl>>, () => void] {
  let isCancelled = false;
  let isPlaying = false;
  let loadedSounds = new Array<Howl>();

  const promise = new Promise<Array<Howl>>((resolve, reject) => {
    let loadedSoundCount = 0;

    const playSounds = () => {
      for (const loadedSound of loadedSounds) {
        loadedSound.play();
      }
      
      isPlaying = true;

      resolve(sounds);
    };
    
    const sounds = soundFilePaths
      .map(filePath => new Howl({
        src: filePath,
        onload: function(this: Howl) {
          loadedSounds.push(this);
          loadedSoundCount++;
    
          if ((loadedSoundCount === sounds.length) && !isCancelled) {
            playSounds();
          }
        },
        onloaderror: () => {
          loadedSoundCount++;
    
          if (loadedSoundCount === sounds.length) {
            playSounds();
          }
        }
      }));
  });

  const cancellationFn = () => {
    isCancelled = true;

    if (isPlaying) {
      for (const sound of loadedSounds) {
        //sound.stop();
        sound.fade(1, 0, 300);
      }
    }
  };

  return [promise, cancellationFn];
}
export function loadAndPlaySoundsSequentially(soundFilePaths: Array<string>, delayInMs: number, cutOffSounds: boolean = false): () => void {
  let isCancelled = false;
  let internalCancelFn: (() => void) | null;
  const cancelFn = () => {
    if (!isCancelled) {
      isCancelled = true;

      if (internalCancelFn) {
        internalCancelFn();
      }
    }
  };

  loadSoundsAsync(soundFilePaths)
    .then(sounds => {
      if (!isCancelled) {
        internalCancelFn = playSoundsSequentially(sounds, delayInMs, cutOffSounds);
      }
    });
  
  return cancelFn
}

export function playSounds(sounds: Array<Howl>) {
  for (const sound of sounds) {
    sound.play();
  }
}
export function playSoundsSequentially(sounds: Array<Howl>, delayInMs: number, cutOffSounds: boolean = false): () => void {
  let isCancelled = false;

  for (let uncapturedI = 0; uncapturedI < sounds.length; uncapturedI++) {
    const i = uncapturedI; // capture the index for the lambda
    const sound = sounds[i];

    sound.stop();
    sound.volume(1);

    if (sound) {
      setTimeout(() => {
        if (isCancelled) { return; }

        // stop the previous sound if necessary
        if (cutOffSounds && (i > 0)) {
          const previousLoadedSound = sounds[i - 1];

          if (previousLoadedSound) {
            previousLoadedSound.fade(1, 0, 300);
          }
        }

        // play the current sound
        sound.play();
      }, delayInMs * i);
    }
  }
  
  const cancelFn = () => isCancelled = true;
  return cancelFn;
}

export function getRMS(spectrum: Uint8Array) {
  let rms = 0;
  for (let i = 0; i < spectrum.length; i++) {
    rms += spectrum[i] * spectrum[i];
  }
  rms = Math.sqrt(rms / spectrum.length);
  return rms;
}