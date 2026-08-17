import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Difficulty, TestResult, TestState, WpmDataPoint } from '../types';
import { soundEngine } from '../utils/sound';
import { getPerformanceMessage } from '../utils/calculateWpm';
import { AlertCircle, Globe, RotateCcw } from 'lucide-react';

interface TypingAreaProps {
  targetText: string;
  duration: number;
  difficulty: Difficulty;
  soundEnabled: boolean;
  onFinish: (result: TestResult) => void;
  onRestart: () => void;
  isTypingActive: boolean;
  setIsTypingActive: (active: boolean) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  duration,
  difficulty,
  soundEnabled,
  onFinish,
  onRestart,
  isTypingActive,
  setIsTypingActive,
}) => {
  const [typedChars, setTypedChars] = useState<string>('');
  const [testState, setTestState] = useState<TestState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const initialLineTopRef = useRef<number | null>(null);
  const lineHeightRef = useRef<number>(50);

  // Keep references to latest values for stable timer / callbacks
  const typedCharsRef = useRef(typedChars);
  typedCharsRef.current = typedChars;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const wpmHistoryRef = useRef(wpmHistory);
  wpmHistoryRef.current = wpmHistory;

  // Pre-split words and compute word character ranges once
  const wordsData = useMemo(() => {
    const rawWords = targetText.split(' ');
    let runningCharIndex = 0;
    return rawWords.map((word, wordIdx) => {
      const startIndex = runningCharIndex;
      const length = word.length;
      const endIndex = startIndex + length; // index of space or end
      runningCharIndex += length + 1; // +1 for space
      return {
        word,
        wordIdx,
        startIndex,
        endIndex,
        chars: word.split(''),
      };
    });
  }, [targetText]);

  // Current active word index based on typed characters length
  const activeWordIndex = useMemo(() => {
    const currentTypedLen = typedChars.length;
    for (let i = 0; i < wordsData.length; i++) {
      if (currentTypedLen <= wordsData[i].endIndex) {
        return i;
      }
    }
    return wordsData.length - 1;
  }, [typedChars.length, wordsData]);

  // Reset state when duration, targetText, or testState becomes idle
  useEffect(() => {
    if (testState === 'idle') {
      setTimeLeft(duration);
      setTypedChars('');
      setWpmHistory([]);
      setIsTypingActive(false);
      startTimeRef.current = null;
      initialLineTopRef.current = null;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (wordsContainerRef.current) {
        wordsContainerRef.current.style.transform = 'translateY(0px)';
      }
    }
  }, [duration, targetText, testState, setIsTypingActive]);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    focusInput();
  }, [targetText, testState, focusInput]);

  // Capture initial line top on mount/text change
  useEffect(() => {
    if (wordsContainerRef.current) {
      const firstEl = wordsContainerRef.current.firstElementChild as HTMLElement | null;
      if (firstEl) {
        initialLineTopRef.current = firstEl.offsetTop;
        lineHeightRef.current = firstEl.offsetHeight || 50;
      }
    }
  }, [targetText]);

  // Global listener for Enter / Tab restart
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') &&
        document.activeElement.id !== 'hidden-typing-input'
      ) {
        return;
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        onRestart();
        setTimeout(focusInput, 15);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [onRestart, focusInput]);

  // Stable Auto-Scrolling: Shifts active line ONLY when moving past Line 2 so Line 1 never disappears early
  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const activeWordEl = activeWordRef.current;
      const containerEl = wordsContainerRef.current;

      if (initialLineTopRef.current === null) {
        const firstEl = containerEl.firstElementChild as HTMLElement | null;
        if (firstEl) {
          initialLineTopRef.current = firstEl.offsetTop;
          lineHeightRef.current = firstEl.offsetHeight || 50;
        }
      }

      const initialTop = initialLineTopRef.current ?? 0;
      const currentTop = activeWordEl.offsetTop;
      const deltaY = currentTop - initialTop;
      const lineH = lineHeightRef.current || 50;

      // Only scroll when the active word has progressed to line 3 or below
      if (deltaY > lineH * 1.35) {
        const targetScroll = deltaY - lineH;
        containerEl.style.transform = `translateY(-${Math.max(0, targetScroll)}px)`;
      } else {
        containerEl.style.transform = 'translateY(0px)';
      }
    }
  }, [activeWordIndex]);

  // Precise Stats Calculation
  const stats = useMemo(() => {
    const totalTyped = typedChars.length;
    if (totalTyped === 0 || testState === 'idle') {
      return {
        correct: 0,
        incorrect: 0,
        totalTyped: 0,
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
      };
    }

    let correct = 0;
    let incorrect = 0;

    for (let i = 0; i < totalTyped; i++) {
      if (i < targetText.length) {
        if (typedChars[i] === targetText[i]) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        incorrect++;
      }
    }

    let elapsedSeconds = 1;
    if (startTimeRef.current) {
      elapsedSeconds = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    } else {
      elapsedSeconds = Math.max(1, duration - timeLeft);
    }

    const elapsedMinutes = elapsedSeconds / 60;
    const currentWpm = Math.round((correct / 5) / elapsedMinutes);
    const rawWpm = Math.round((totalTyped / 5) / elapsedMinutes);
    const accuracy = totalTyped > 0 ? Math.max(0, Math.round((correct / totalTyped) * 100)) : 100;

    return {
      correct,
      incorrect,
      totalTyped,
      wpm: currentWpm,
      rawWpm,
      accuracy,
    };
  }, [typedChars, targetText, duration, timeLeft, testState]);

  // Stable Finish Test function
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTestState('finished');
    setIsTypingActive(false);

    if (soundEnabled) {
      soundEngine.playSuccessChime();
    }

    const currentTyped = typedCharsRef.current;
    const totalTyped = currentTyped.length;
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < totalTyped; i++) {
      if (i < targetText.length && currentTyped[i] === targetText[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    let exactElapsedSeconds = duration - timeLeftRef.current;
    if (startTimeRef.current) {
      exactElapsedSeconds = Math.max(1, (Date.now() - startTimeRef.current) / 1000);
    }
    if (exactElapsedSeconds <= 0) exactElapsedSeconds = 1;

    const elapsedMinutes = exactElapsedSeconds / 60;
    const finalWpm = Math.round((correct / 5) / elapsedMinutes);
    const finalRawWpm = Math.round((totalTyped / 5) / elapsedMinutes);
    const finalAccuracy = totalTyped > 0 ? Math.max(0, Math.round((correct / totalTyped) * 100)) : 100;

    const perf = getPerformanceMessage(finalWpm, finalAccuracy);

    const result: TestResult = {
      id: 'res_' + Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: totalTyped,
      timeTaken: Math.round(exactElapsedSeconds),
      durationSetting: duration,
      difficulty,
      performanceMessage: perf.title,
      wpmHistory: wpmHistoryRef.current,
    };

    onFinish(result);
  }, [targetText, duration, difficulty, soundEnabled, onFinish, setIsTypingActive]);

  const finishTestRef = useRef(finishTest);
  finishTestRef.current = finishTest;

  // Single Timer Setup
  useEffect(() => {
    if (testState === 'running') {
      setIsTypingActive(true);

      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            finishTestRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [testState, setIsTypingActive]);

  // Record history datapoints every second
  useEffect(() => {
    if (testState === 'running') {
      const currentSecond = duration - timeLeft;
      if (currentSecond > 0) {
        setWpmHistory((prev) => [
          ...prev,
          {
            second: currentSecond,
            wpm: stats.wpm,
            rawWpm: stats.rawWpm,
            errors: stats.incorrect,
          },
        ]);
      }
    }
  }, [timeLeft, testState, duration, stats.wpm, stats.rawWpm, stats.incorrect]);

  // High-performance key handler (Instant 0ms latency)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));

    // Quick restart on Enter or Tab
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      onRestart();
      return;
    }

    if (testState === 'finished') return;

    // Start timer on first valid keypress and lock startTimeRef
    if (testState === 'idle') {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        startTimeRef.current = Date.now();
        setTestState('running');
      }
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length === 0) return;

      if (e.ctrlKey || e.altKey || e.metaKey) {
        // Delete previous whole word
        const lastSpaceIndex = typedChars.trimEnd().lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
          setTypedChars('');
        } else {
          setTypedChars(typedChars.substring(0, lastSpaceIndex + 1));
        }
      } else {
        setTypedChars((prev) => prev.slice(0, -1));
      }

      if (soundEnabled) {
        soundEngine.playKeyClick('backspace');
      }
      return;
    }

    // Handle character input
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const currentLen = typedChars.length;
      
      // Stop typing if target reached
      if (currentLen >= targetText.length) {
        finishTestRef.current();
        return;
      }

      const expectedChar = targetText[currentLen];
      const typedChar = e.key;
      const isCorrect = typedChar === expectedChar;

      // Play instant sound feedback
      if (soundEnabled) {
        if (isCorrect) {
          soundEngine.playKeyClick(typedChar === ' ' ? 'space' : 'char');
        } else {
          soundEngine.playKeyError();
        }
      }

      const nextTyped = typedChars + typedChar;
      setTypedChars(nextTyped);

      // If user typed the last character of target text, finish test immediately
      if (nextTyped.length >= targetText.length) {
        finishTestRef.current();
      }
    }
  };

  const formatTimeDisplay = (seconds: number) => {
    if (duration >= 60 || seconds >= 60) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${seconds}s`;
  };

  return (
    <div
      id="typing-test-container"
      onClick={focusInput}
      className="relative w-full max-w-5xl lg:max-w-6xl mx-auto my-4 p-2 sm:p-4 cursor-text select-none"
    >
      {/* Invisible Input that captures all keystrokes flawlessly */}
      <input
        ref={inputRef}
        id="hidden-typing-input"
        type="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        value=""
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
        onBlur={focusInput}
        className="fixed -top-[9999px] left-0 opacity-0 pointer-events-none w-1 h-1"
      />

      {/* Top subtle language indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-[#646669] hover:text-[#8a817a] transition-colors mb-4">
        <Globe className="w-3.5 h-3.5" />
        <span className="font-mono lowercase tracking-wide text-xs sm:text-sm">english</span>
      </div>

      {/* CapsLock Warning */}
      {capsLockActive && (
        <div className="mb-4 px-3.5 py-1.5 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-md inline-flex items-center gap-2 text-[#ff6b00] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Caps Lock is ON</span>
        </div>
      )}

      {/* MONKEYTYPE EXACT 3-LINE NATURAL VIEWPORT */}
      <div className="relative h-[155px] sm:h-[165px] md:h-[175px] overflow-hidden px-2 sm:px-4 py-1 font-mono-code text-[26px] sm:text-[28px] md:text-[31px] leading-[1.7] tracking-normal">
        {/* Sliding Words Flow Container */}
        <div
          ref={wordsContainerRef}
          className="flex flex-wrap transition-transform duration-150 ease-out relative select-none"
        >
          {wordsData.map((wItem) => {
            const { wordIdx, startIndex, chars } = wItem;
            const isCurrentActiveWord = wordIdx === activeWordIndex;

            return (
              <span
                key={wordIdx}
                ref={isCurrentActiveWord ? activeWordRef : null}
                className={`inline-flex items-baseline whitespace-nowrap relative mr-[0.55em] transition-all duration-100 rounded-md ${
                  isCurrentActiveWord
                    ? 'bg-[#ff9238]/10 px-1 -mx-1 py-0.5 shadow-[0_0_12px_rgba(255,146,56,0.08)]'
                    : ''
                }`}
              >
                {chars.map((char, charIdx) => {
                  const absoluteCharIdx = startIndex + charIdx;
                  const isTyped = absoluteCharIdx < typedChars.length;
                  const isCurrent = absoluteCharIdx === typedChars.length;
                  const userChar = typedChars[absoluteCharIdx];
                  const isCorrect = isTyped && userChar === char;
                  const isIncorrect = isTyped && userChar !== char;

                  return (
                    <span
                      key={charIdx}
                      className={`relative transition-colors duration-75 font-mono ${
                        isTyped
                          ? isCorrect
                            ? 'text-[#d1d0c5]'
                            : 'text-[#ca4754] border-b-2 border-[#ca4754]'
                          : isCurrentActiveWord
                          ? 'text-[#9ca3af]'
                          : 'text-[#646669]'
                      }`}
                    >
                      {/* Exact Glowing Vertical Cursor Bar */}
                      {isCurrent && (
                        <span className="absolute -left-[2px] top-[10%] bottom-[10%] w-[2.5px] bg-[#ff9238] animate-cursor-blink z-10 shadow-[0_0_8px_#ff9238]" />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Trailing Space Cursor Representation */}
                {wordIdx < wordsData.length - 1 && (() => {
                  const spaceIdx = startIndex + chars.length;
                  const isTyped = spaceIdx < typedChars.length;
                  const isCurrent = spaceIdx === typedChars.length;
                  const userChar = typedChars[spaceIdx];
                  const isIncorrectSpace = isTyped && userChar !== ' ';

                  return (
                    <span
                      key="space"
                      className={`relative inline-block w-0 text-center ${
                        isIncorrectSpace ? 'border-b-2 border-[#ca4754]' : ''
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute -left-[1px] top-[10%] bottom-[10%] w-[2.5px] bg-[#ff9238] animate-cursor-blink z-10 shadow-[0_0_8px_#ff9238]" />
                      )}
                    </span>
                  );
                })()}
              </span>
            );
          })}
        </div>
      </div>

      {/* Restart Button (Centered beneath text area) */}
      <div className="flex justify-center items-center mt-6 mb-2">
        <button
          id="quick-restart-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
            setTimeout(focusInput, 15);
          }}
          title="Restart Test (Tab / Enter)"
          className="p-2 text-[#646669] hover:text-[#d1d0c5] hover:bg-[#2c2e31]/40 rounded-lg transition-all duration-150 active:scale-95 group"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform duration-200" />
        </button>
      </div>

      {/* Sleek Minimal Stats Bar Below */}
      <div className="flex items-center justify-center gap-8 sm:gap-14 mt-4 py-3 px-8 bg-[#171411]/80 border border-[#2c241c] rounded-xl max-w-lg mx-auto shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#ff9238]">
            {stats.wpm}
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-0.5">
            WPM
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#ff9238]">
            {stats.accuracy}%
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-0.5">
            Accuracy
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#ff9238]">
            {formatTimeDisplay(timeLeft)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-0.5">
            Time Left
          </span>
        </div>
      </div>
    </div>
  );
};
