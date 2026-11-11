# The Last Espresso in the Galaxy

First playable chapter: a mint alien cat rescues three kittens in a moon observatory and returns to the espresso machine. The hover-ship prototype is separate.

## Play

Open `index.html` in a browser. It is self-contained: no server, package installation, remote dependencies or API keys. It works offline after downloading.

Move with arrows or A/D; Space jumps; Shift stalks; X hisses to stun drones; C swipes away branches; E spends one coffee for a speed/jump boost. On touch screens, hold movement and tap an action with another finger. Pause with the pause button or Escape. Restart resets the run. No saving after closing the page.

## Source

`engine.ts` is the readable TypeScript game model. `animations.json` maps the animation atlas embedded in `index.html`. The compiled game model and all assets are embedded in `index.html` for direct play.

Animation baseline: v4 pixel cat with flexing spine and tail follow-through. Walk, run, stalk, jump/landing, startle, hiss, paw swipe, and idle turn/tilt/blink are integrated. Reference for cycle timing and tail motion: Vuena Blocky Pets, CC0, https://vuena.itch.io/blocky-pets-free . No model file from that pack is embedded here. Jump root displacement is handled by game physics.

## Current limitations

First chapter, not a finished full game. Limbs remain angular and run-tail movement subtle. No sound. No real-phone or child playtest yet. Browser layouts checked at 320, 390 and 1280 pixels. An input-only deterministic full route rescues all three kittens and reaches the ending without teleporting state. Separate fixtures check damage, falls, coffee boost, rescue, hiss and branch clearing.

Spatial play is not accessible non-visually; buttons have names and the canvas has a text description.
