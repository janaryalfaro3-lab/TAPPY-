import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tappy_order_sound_enabled';
const EVENT_NAME = 'tappy-sound-notification-changed';

/**
 * Hook for playing a subtle 'ping' audio notification on successful order completion.
 * SILENT BY DEFAULT: Audio is muted until explicitly toggled on in the admin panel.
 */
export function useOrderSoundNotification() {
  // Silent-by-default: initialize to false unless explicitly saved as 'true' in localStorage
  const [isSoundEnabled, setIsSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Keep state in sync across components and tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIsSoundEnabledState(e.newValue === 'true');
      }
    };

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsSoundEnabledState(Boolean(customEvent.detail));
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(EVENT_NAME, handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
    };
  }, []);

  // Update setting in localStorage and dispatch event
  const setSoundEnabled = useCallback((enabled: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
      setIsSoundEnabledState(enabled);
      window.dispatchEvent(new CustomEvent<boolean>(EVENT_NAME, { detail: enabled }));
    } catch (e) {
      console.warn('Could not save sound notification preference:', e);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(!isSoundEnabled);
  }, [isSoundEnabled, setSoundEnabled]);

  /**
   * Generates a subtle, high-clarity bell ping chime using the browser's Web Audio API.
   * Zero external audio files required.
   */
  const synthesizePing = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Master gain for soft, non-intrusive volume
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, now);
      masterGain.connect(ctx.destination);

      // Primary crystal ping tone (C6: 1046.5 Hz -> slight pitch bend)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08); // subtle upward sparkle (D6)

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.8, now + 0.015); // gentle 15ms attack
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38); // clean exponential decay

      osc1.connect(gain1);
      gain1.connect(masterGain);

      // Secondary overtone for warm resonance (E6: 1318.5 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, now + 0.02);

      gain2.gain.setValueAtTime(0.001, now + 0.02);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.035);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc2.connect(gain2);
      gain2.connect(masterGain);

      // Start and stop cleanly
      osc1.start(now);
      osc1.stop(now + 0.4);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.32);

      // Clean up audio context
      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
      }, 500);
    } catch (err) {
      console.warn('Audio notification play error:', err);
    }
  }, []);

  /**
   * Plays the ping sound ONLY IF sound notifications have been explicitly toggled on.
   * Remains completely silent if the user/admin has not turned it on.
   */
  const playOrderSuccessPing = useCallback(() => {
    if (!isSoundEnabled) {
      // Strictly silent-by-default: do nothing
      return;
    }
    synthesizePing();
  }, [isSoundEnabled, synthesizePing]);

  /**
   * Sample/test the sound (used in Admin Panel preview button)
   */
  const previewPing = useCallback(() => {
    synthesizePing();
  }, [synthesizePing]);

  return {
    isSoundEnabled,
    setSoundEnabled,
    toggleSound,
    playOrderSuccessPing,
    previewPing,
  };
}
