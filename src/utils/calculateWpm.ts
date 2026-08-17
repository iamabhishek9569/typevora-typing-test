import { Difficulty, TestResult, TestSettings } from '../types';

export const DEFAULT_SETTINGS: TestSettings = {
  duration: 30,
  difficulty: 'intermediate',
  soundEnabled: true,
  soundVolume: 0.5,
  showLiveWpm: true,
};

export function getPerformanceMessage(wpm: number, accuracy: number): { title: string; subtitle: string } {
  if (accuracy < 85) {
    return {
      title: "Focus on Accuracy!",
      subtitle: "Slow down slightly to build clean muscle memory and precision."
    };
  }

  if (wpm >= 100) {
    return {
      title: "Master Typist!",
      subtitle: "Incredible velocity! You are in the top 1% of typists worldwide."
    };
  }
  if (wpm >= 80) {
    return {
      title: "Blazing Fast!",
      subtitle: "Phenomenal typing speed with razor-sharp execution."
    };
  }
  if (wpm >= 60) {
    return {
      title: "Great Job!",
      subtitle: "High efficiency! Well above average typing speed."
    };
  }
  if (wpm >= 40) {
    return {
      title: "Good Work!",
      subtitle: "Smooth and steady typing rhythm. Consistent practice pays off."
    };
  }
  if (wpm >= 25) {
    return {
      title: "Keep Going!",
      subtitle: "Nice foundation! Focus on keeping your hands resting on the home row."
    };
  }
  return {
    title: "Keep Practicing!",
    subtitle: "Focus on hitting every single key without looking down at the keyboard."
  };
}

const STORAGE_KEY_HISTORY = 'typevora_test_history_v1';
const STORAGE_KEY_SETTINGS = 'typevora_test_settings_v1';

export function loadStoredHistory(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
}

export function saveResultToHistory(result: TestResult): TestResult[] {
  try {
    const current = loadStoredHistory();
    const updated = [result, ...current].slice(0, 100); // keep last 100 tests
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save result", e);
    return [];
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}

export function loadStoredSettings(): TestSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: TestSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}
