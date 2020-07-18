# To-Do
## Other
## Pomodoro
## Now
* MIDI Player
  * MVP
    * Pick a MIDI file
    * Play
    * Render analysis
  * UI
    * Render piano at bottom of screen
  * Logic
    * Load MIDI file into data structure
    * Analyze MIDI file
    * Play MIDI file
## High Priority



* Better slideshow navigation


* Intervals section
* Scale fingerings
* Improve self-paced scale/chord mastery



* Integrate payment processor




* Lock part of course based on whether user has paid or not.
  * Visual indicators on home page
  * Lock in slideshow
  * Buttons to buy


* Improve profile page
  * Better logout button position
  * Highlight unowned products available for purchase
* Improve user icon
  * Indicate logged in vs logged off?
    * Login button when logged off?
    * same user icon taking you to profile when logged in?
* Make mobile usable
* Review content
  * "Quiz" -> "Exercise"?
  * scale & chord capitalization



* MIDI keyboard recommendations



* Search bar?
* Hide "Learn More" links?

* Marketing
  * SEO
  * YouTube ads
    * "Stop memorizing piano music and start understanding it
  * Pay influencers?
  * Get good standing on social website, share
    * Reddit
    * Facebook groups
    * Forums
  * Review & discount codes

* roman numerals quiz
* Add degree #'s to self paced chord mastery
* improve self-paced pages

* Make sure everything in essential music theory is also in new course
* Understanding the Piano Keyboard
  * Self-Paced Scale Mastery
    * Improve scale type select
    * MIDI piano integration
    * Fingering
    * Multiple mastery steps:
      * Play scale in 2nds, 3rd, etc.
      * Diatonic chord inversions
  * Chords Section
    * Self-Paced Chord Mastery
      * For all root notes
        * Inversions
        * Note name -> scale degree
        * Know intervals
        * Know major scale based formula?
  * Chord Progressions Section
    * Review content
    * MIDI piano integration
  * ??? Advanced Chords Section ???
    * Extended chords, omissions
    * Chord-scale equivalence
  * Improve navigation (enable easy jumping between sections).
  * Improve URLs (use slashes instead of ?)
  * document title changes?
  * Move navigation buttons to bottom on mobile.
  * Improve layout
* Debug & fix scale viewer & chord viewer
* Fix level not being detected properly when disabling & re-enabling in piano notes exercise (orders don't match due to toggle).
* Improve Quizzes
  * Save quiz completion?
* Account system
  * Email confirmation
  * 2FA?
  * Save data
## Medium Priority
* Ear Training/Sight Singing Course
  * Singing notes after hearing them
  * Singing intervals (hear note, go up & down in random order)
    * NEED TO DETERMINE ORDER OF INTERVALS
  * Singing scales
    * Up & down
    * Major
    * Minor
    * Self-paced
    * Singing degrees
  * Singing chords (really arpeggios)
    * Triads -> 7 -> etc.
    * Inversions
    * Up/down
    * Singing degrees
* Scoped stylesheets
* Fix on mobile
* Improve chord finder (E G B D F is Emin7b9)
* Turn exercises into "active" exercises
  * Piano Intervals
  * Piano Scales
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
    * Diatonic chords
    * Scales
    * Scale Degrees
    * Chord "Degrees"
    * Chord progressions
## Low Priority
* Understanding the Piano Keyboard
  * Piano scale drone player release stop playing?
  * Pressing the correct note doesn't play the sound...
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