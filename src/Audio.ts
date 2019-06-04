import { Howl } from "howler";

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
export function loadAndPlaySoundsSimultaneously(soundFilePaths: Array<string>): Promise<Array<Howl>> {
  return new Promise((resolve, reject) => {
    const loadedSounds = new Array<Howl>();
    let loadedSoundCount = 0;

    const playSounds = () => {
      for (const loadedSound of loadedSounds) {
        loadedSound.play();
      }

      resolve(sounds);
    };
    
    const sounds = soundFilePaths
      .map(filePath => new Howl({
        src: filePath,
        onload: function(this: Howl) {
          loadedSounds.push(this);
          loadedSoundCount++;
    
          if (loadedSoundCount === sounds.length) {
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

    if (sound) {
      setTimeout(() => {
        // stop the previous sound if necessary
        if (cutOffSounds && (i > 0)) {
          const previousLoadedSound = sounds[i - 1];

          if (previousLoadedSound) {
            previousLoadedSound.fade(1, 0, 300);
          }
        }

        // play the current sound
        if (!isCancelled) {
          sound.play();
        }
      }, delayInMs * i);
    }
  }
  
  const cancelFn = () => isCancelled = true;
  return cancelFn;
}