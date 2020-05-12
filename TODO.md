# To-Do
## High Priority
* Piano Theory
  * Notes Section
    * Press all of a given note on keyboard before continuing.
  * Self-Paced Scale Mastery
    * Fix MIDI piano integration
    * Fingering
    * Multiple mastery steps:
      * Play scale in 2nds, 3rd, etc.
      * Diatonic chord inversions
  * Chords Section
    * Quiz(zes)
    * Extended chords
    * Chord-scale equivalence
    * Roman Numeral Notation? (or in prog lesson?)
    * Self-Paced Chord Mastery
      * Pick a type of chord
      * For all root notes
        * Play chord
        * Inversions
        * Note name -> scale degree
        * Know intervals
        * Know major scale based formula?
  * Chord Progressions Section
  * Improve navigation (enable easy jumping between sections).
  * document title changes?
* Debug & fix scale viewer & chord viewer
* Fix level not being detected properly when disabling & re-enabling in piano notes exercise (orders don't match due to toggle).
* Improve Home Page
* Improve Quizzes
  * One-time quizzes?
  * Better positioning of "Show Question/Answer" for user-determined answers?
  * Save quiz completion?
* Account system
  * Creation
  * Changes
  * Recover password
  * 2FA?
  * Save data
* Monetize
## Medium Priority
* Improve chord finder (E G B D F is Emin7b9)
* Fix piano aspect ratios.
  * EMT Notes section, intervals
  * Chord Viewer
  * Chord Progressions
* Turn exercises into "active" exercises
  * Piano Intervals
  * Piano Scales
  * Guitar Notes
  * Guitar Intervals
  * Guitar Scales
  * Guitar Chords
* Future Lessons:
  * Rhythm
  * Sheet Music
    * Rhythm
    * Clefs
    * Notes
    * Accidentals
    * Key Signatures
    * Intervals
    * Chords
    * Dynamics
    * Other markings
  * Sight Singing
    * Intervals (ascending & descending)
    * Diatonic Intervals
    * Chords
    * Scales
    * Scale Degrees
    * Chord "Degrees"
## Low Priority
* Re-enable main menu
* Piano Theory
  * Piano scale drone player release stop playing?
  * Pressing the correct note doesn't play the sound...
  * Piano notes exercises all have the same progress... Do I want that?
* Get rid of flash card set container height.
* Split scale types up into files.
* Refactor pitch class into multiple (canonical, ambiguous)
* Improve chord types (support arbitrary pitch integers)
* Add key signature support to:
  * Sheet Music Notes
  * Sheet Music Intervals
  * Sheet Music Chords
* New Exercises
  * Sheet Music Scales
* Add chord inversion support to (or new exercises):
  * Piano Chords
  * Guitar Chords
  * Sheet Music Chords
* Separate "Sheet Music Chord Types" (the current "Sheet Music Chords" exercise) and "Sheet Music Chord" (which makes the user identify the chord root as well) exercises
* Base "Learn the notes on guitar in 10 steps" on the A minor scale for less steps in total. Redirect the URL.
* Number & link to figures in lessons
* Glossary
  * Expand content
  * Display synonyms
## Refactoring
* ScaleViewer render()
* Get rid of material UI