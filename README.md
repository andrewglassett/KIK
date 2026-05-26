# KIK

https://andrewglassett.github.io/KIK/

A browser-based bass drum synthesizer and step sequencer. No dependencies — just a single HTML file using the Web Audio API.

## Features

- **16-step sequencer** with two independent kick drum channels (K1 / K2)
- **Synthesizer controls** per kick: attack, sustain, release, pitch, waveform (triangle → sine → square), pitch bend, bend time, and click transient
- **FX chain** per kick: distortion drive, delay (time + mix), granular reverb (size + grain density + mix), and bit crusher
- **Dynamics compressor** with threshold, ratio, attack, release, knee, and makeup gain — with a live input/output curve visualizer and gain reduction meter
- **Master filter** (lowpass) with knob control
- **Oscilloscope** showing the live output waveform
- **Presets** — save, load, and delete named presets via `localStorage`
- **Auto-save** — session state persists across page reloads
- **Randomize** button for instant kick sound exploration
- BPM control (60–200)

## Local development

```bash
node server.js
```

Opens at `http://localhost:3000` with live-reload on file changes.
