# To-Do
## High Priority
* Fix bug on dynamic flash cards where if you look at the answer, then the question, it's different.
* Violin Notes "more info" URI
* Add "Move to next level" button, remove always-there "next level" text
* Actually fix levels implementation.
* Refactor & check everything.
* Singing interval ear trainer (note plays, sing above & below)
  * FFT library, pick out main tone
* Double-check piano scales
* Persistent data
  * Carefully review flash card IDs
  * Add in-memory flash card stats DB
    * Use it, make sure tracking works
      * Include levels
    * Show the data in some way
      * knowledge map with percentages?
    * Save in local storage if you aren't logged in?
  * Allow log in/log out/account management
  * Show data specific to current account

* Chord Progressions
  * Ensure it works on mobile.
* Implement button colors for
  * GuitarChordsAnswerSelect
  * GuitarNotesAnswerSelect
  * PianoKeysAnswerSelect
  * PianoChordsAnswerSelect
  * ScaleAnswerSelect
* Fix not being able to click on some buttons in Sheet Music Intervals
* Make sure pitches in GuitarNote.allNotesOfPitches use the right accidentals.
* Make sure PianoScaleDronePlayer.renderExtrasFn uses the right accidentals.
* Scale Viewer
  * If only showing guitar, fix root note octaves.
* Marketing Plan
  * Integrate with Beato Book?
  * Post on Reddit with text tutorial?
  * Other YouTubers?
* Monetization Plan
  * Partnership, take cut of profits
    * YouTube, schools
  * Affiliate marketing
* Chords
  * Fix on portrait mobile.
* Scale Viewer
  * If only showing guitar, fix root note octaves.
* Guitar Scales Lesson
  * Play **guitar** sounds?
  * Major scale repeating pattern game?
* Make ear training exercises play automatically when you skip.
* Implement Guitar Chords
* Lessons
  * Sheet music notes
  * Piano notes
  * Guitar notes
    * Start with "A" instead of "G"
* Exercises
  * Scale degree ear trainer
* Interactive Diagrams
  * Press piano keys, see notes, intervals, chords, scales
  * Plain playable piano?
* Add sheet music notes lesson.
* Add "Next Steps"
* SVG rendering improvements
  * Improve SVG rendering to be scalable.
  * Improve SVG text align
    * Horizontal align
    * dy
* Highlight root note in scale/chord viewers
* Show scale degree #'s in piano scales.
## Medium Priority
* Global sound cutoffs
* Reload page when switching?
* Rhythm tapper
## Low Priority
* Improve button styling.
* Use proper symbols.
  * Flat, sharp, natural
* Chord intervals.
* Chord Symbols
* Add support for dynamically generated flash card decks.
* Share more code between interval recognition exercises.
* Interval Type Changes When Lowering/Raising
* Implement isEmbedded for ScaleViewer & RhythmTapper
## Refactoring
* Use a higher-level construct for checkbox configs.