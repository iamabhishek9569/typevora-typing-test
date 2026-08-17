export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type TestDuration = 15 | 30 | 60 | 120 | 'custom';

export type TestState = 'idle' | 'running' | 'finished';

export interface WpmDataPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  date: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeTaken: number;
  durationSetting: number | string;
  difficulty: Difficulty;
  performanceMessage: string;
  wpmHistory: WpmDataPoint[];
}

export interface TestSettings {
  duration: number; // in seconds
  difficulty: Difficulty;
  soundEnabled: boolean;
  soundVolume: number;
  showLiveWpm: boolean;
}
