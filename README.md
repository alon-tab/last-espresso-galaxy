# The Last Espresso in the Galaxy

First playable chapter: a mint alien cat rescues three kittens in a moon observatory and returns to the espresso machine. The hover-ship prototype is separate.

## Play

Play directly at https://alon-tab.github.io/last-espresso-galaxy/ . Or open `index.html` in a browser. It is self-contained: no server, package installation, remote dependencies or API keys. It works offline after downloading.

Move with arrows or A/D; Space jumps; Shift stalks; X hisses to stun drones; C swipes away branches; E spends one coffee for a speed/jump boost. On touch screens, hold movement and tap an action with another finger. Pause with the pause button or Escape. Restart resets the run. A safe-ground autosave keeps progress in this browser. Use Continue after reopening. New Game asks before deleting the save. Clearing browser data deletes it; there is no cross-device sync. Short synthesized effects start OFF and can be toggled.

## Source

`engine.ts` is the readable TypeScript game model. `session.ts` contains save validation and original synthesized effects. `animations.json` maps the animation atlas embedded in `index.html`. The compiled game model and all assets are embedded in `index.html` for direct play.

Animation baseline: v4 pixel cat with flexing spine and tail follow-through. Walk, run, stalk, jump/landing, startle, hiss, paw swipe, and idle turn/tilt/blink are integrated. Reference for cycle timing and tail motion: Vuena Blocky Pets, CC0, https://vuena.itch.io/blocky-pets-free . No model file from that pack is embedded here. Jump root displacement is handled by game physics.

## Current limitations

First chapter, not a finished full game. Limbs remain angular and run-tail movement subtle. No music or recorded voices. No real-phone or child playtest yet. Browser layouts checked at 320, 390 and 1280 pixels. An input-only deterministic full route rescues all three kittens and reaches the ending without teleporting state. Separate fixtures check damage, falls, coffee boost, rescue, hiss and branch clearing.

Spatial play is not accessible non-visually; buttons have names and the canvas has a text description.

## Save/audio update verification

The same engine, atlas, save schema and effect synthesizer are used by the hosted and offline versions. Hosted saves use the viewer's device/account-local state: signed-in viewers can reopen; public anonymous visitors and private previews keep only memory while open. Offline HTML uses browser localStorage, reports storage failures, and remains playable when storage is blocked. Nothing is uploaded or shared from a save.

Tested: reload/continue with position and coffee retained, malformed and incompatible saves rejected, unsafe locations not saved, collected kittens and opened gates retained in engine fixtures, pause/resume, new-game cancel/confirm, sound-off startup and explicit on/mute, denied-storage handling, and the unchanged full input-only route. The browser audio context and note scheduling were checked, not a listening test on physical speakers. Owner-authenticated hosted persistence across reload has not been tested.

## World-feedback pass

One contextual cue appears before blocked branches or a nearby active drone. Hiss/swipe no longer report success when nothing is in range. Stunned drones show a remaining-time strip; rescued cages leave green beacons, opened branches leave a stump, boosts have a duration bar, and damage briefly tints the screen. These are visual/message changes only, not new obstacles or a new level. Route and save/audio regression tests still pass.

## Touch layout check

Simulated Chrome touch verified two-finger move+jump, independent finger release, cancellation and focus-loss pause. Short landscape screens use a shorter, letterboxed scene so movement/action buttons can share the viewport. The compact-view toggle gives the same option in auto-height embedded viewers; regular view remains available. Portrait layouts and game physics are unchanged. This is not a physical phone test.

## First-run guidance and recovery

A persistent objective names the nearest kitten still missing, tells whether it is to the left/right or on a balcony above, and switches to the espresso machine after all three rescues. Contextual prompts teach movement, the first jump and optional coffee use. Drone/branch prompts take priority near those obstacles. Prompts only describe existing controls; physics, difficulty, level geometry and v4 animation are unchanged. Save schema stays v1.

Expert simulation verified each missed kitten: skip it, reach the end, backtrack using only normal inputs, rescue it and finish. The three routes all pass without position/health/world-state writes. This is not an uncoached child playtest. Existing saves, no-coffee-required completion, sound-off, restart and touch regressions still pass.
