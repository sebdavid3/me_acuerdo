/**
 * Sonidos procedimentales (Web Audio API)
 * No necesitan archivos externos.
 */

function createFlipSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  return function play() {
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const duration = 0.35;

    // Ruido blanco filtrado
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + duration);
    filter.Q.setValueAtTime(0.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + duration);
  };
}

/**
 * Sonido de clic sutil — un "tick" muy corto y suave.
 * ~60ms, banda alta, volumen bajo.
 */
function createClickSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  return function play() {
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const duration = 0.06;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, t);
    filter.frequency.exponentialRampToValueAtTime(600, t + duration);
    filter.Q.setValueAtTime(1.5, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + duration);
  };
}
