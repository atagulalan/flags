/**
 * Play a sound effect using Web Audio API
 * @param frequency - Frequency in Hz
 * @param duration - Duration in milliseconds
 * @param type - Waveform type ('sine', 'square', 'sawtooth', 'triangle')
 */
export function playSound(
  frequency: number,
  duration: number = 200,
  type: OscillatorType = 'sine'
): void {
  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    // Envelope for smoother sound
    const now = audioContext.currentTime
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000)

    oscillator.start(now)
    oscillator.stop(now + duration / 1000)
  } catch (error) {
    // Silently fail if audio context is not available
    console.warn('Could not play sound:', error)
  }
}

/**
 * Play success sound (higher pitch, pleasant tone)
 */
export function playSuccessSound(): void {
  playSound(800, 150, 'sine')
  setTimeout(() => playSound(1000, 150, 'sine'), 50)
}

/**
 * Play error sound (lower pitch, harsher tone)
 */
export function playErrorSound(): void {
  playSound(300, 200, 'square')
}
