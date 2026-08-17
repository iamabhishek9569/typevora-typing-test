import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Difficulty, TestResult, TestState, WpmDataPoint } from '../types';
import { soundEngine } from '../utils/sound';
import { getPerformanceMessage } from '../utils/calculateWpm';
import { AlertCircle } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const words = useMemo(() => targetText.split(' '), [targetText]);

  useEffect(() => {
    if (testState === 'idle') {
      setTimeLeft(duration);
      setTypedChars('');
      setWpmHistory([]);
      setIsTypingActive(false);
    }
  }, [duration, targetText, testState, setIsTypingActive]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
  }, [targetText, testState]);

  // Global listener for Enter / Tab restart
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a custom number input or form
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
        setTimeout(focusInput, 10);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [onRestart]);

  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const charEl = activeCharRef.current;
      
      const charOffsetTop = charEl.offsetTop;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (charOffsetTop - containerScrollTop > containerHeight - 70) {
        container.scrollTo({
          top: charOffsetTop - 50,
          behavior: 'smooth',
        });
      } else if (charOffsetTop < containerScrollTop + 20) {
        container.scrollTo({
          top: Math.max(0, charOffsetTop - 20),
          behavior: 'smooth',
        });
      }
    }
  }, [typedChars]);

  const stats = useMemo(() => {
    const totalTyped = typedChars.length;
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

    const elapsedSeconds = testState === 'idle' ? 0 : Math.max(0.1, duration - timeLeft);
    const elapsedMinutes = elapsedSeconds / 60;

    const currentWpm = elapsedMinutes > 0 ? Math.round((correct / 5) / elapsedMinutes) : 0;
    const rawWpm = elapsedMinutes > 0 ? Math.round((totalTyped / 5) / elapsedMinutes) : 0;
    const accuracy = totalTyped > 0 ? Math.max(0, Math.round((correct / totalTyped) * 100)) : 100;

    return {
      correct,
      incorrect,
      totalTyped,
      wpm: currentWpm,
      rawWpm,
      accuracy,
      elapsedSeconds,
    };
  }, [typedChars, targetText, duration, timeLeft, testState]);

  useEffect(() => {
    if (testState === 'running') {
      setIsTypingActive(true);
      startTimeRef.current = Date.now();

      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [testState]);

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
  }, [timeLeft, testState]);

  const finishTest = () => {
    setTestState('finished');
    setIsTypingActive(false);

    if (soundEnabled) {
      soundEngine.playSuccessChime();
    }

    const finalElapsed = Math.max(1, duration - timeLeft);
    const finalElapsedMin = finalElapsed / 60;
    const finalWpm = Math.round((stats.correct / 5) / finalElapsedMin);
    const finalRawWpm = Math.round((stats.totalTyped / 5) / finalElapsedMin);
    const finalAccuracy = stats.totalTyped > 0 ? Math.round((stats.correct / stats.totalTyped) * 100) : 100;

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
      correctChars: stats.correct,
      incorrectChars: stats.incorrect,
      totalChars: stats.totalTyped,
      timeTaken: finalElapsed,
      durationSetting: duration,
      difficulty,
      performanceMessage: perf.title,
      wpmHistory,
    };

    if (soundEnabled) {
      soundEngine.playSuccessChime();
    }

    onFinish(result);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));

    // Quick restart shortcut: Enter or Tab
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      onRestart();
      return;
    }

    if (testState === 'finished') return;

    if (testState === 'idle') {
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
        setTestState('running');
      }
    }

    if (e.key === 'Backspace') {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        e.preventDefault();
        const lastSpaceIndex = typedChars.lastIndexOf(' ');
        if (lastSpaceIndex === -1) {
          setTypedChars('');
        } else {
          setTypedChars(typedChars.substring(0, lastSpaceIndex));
        }
        if (soundEnabled) soundEngine.playKeyClick('backspace');
        return;
      }

      setTypedChars((prev) => prev.slice(0, -1));
      if (soundEnabled) soundEngine.playKeyClick('backspace');
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const nextIndex = typedChars.length;
      const expectedChar = targetText[nextIndex];
      const typedChar = e.key;

      const isCorrect = typedChar === expectedChar;

      if (soundEnabled) {
        if (isCorrect) {
          soundEngine.playKeyClick(typedChar === ' ' ? 'space' : 'char');
        } else {
          soundEngine.playKeyError();
        }
      }

      const nextTyped = typedChars + typedChar;
      setTypedChars(nextTyped);

      if (nextTyped.length >= targetText.length) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        finishTest();
      }
    }
  };

  let globalCharIndex = 0;

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
      className="relative w-full max-w-4xl mx-auto my-2 p-2 sm:p-4 cursor-text transition-all"
    >
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
        className="absolute inset-0 opacity-0 pointer-events-none w-full h-full cursor-default"
      />

      {/* CapsLock Warning */}
      {capsLockActive && (
        <div className="mb-4 px-3 py-1.5 bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-md inline-flex items-center gap-2 text-[#ff6b00] text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Caps Lock is ON</span>
        </div>
      )}

      {/* Sleek Minimal Typing Area */}
      <div
        ref={containerRef}
        className="font-mono-code text-2xl sm:text-3xl leading-[1.65] max-h-[260px] overflow-y-auto pr-2 select-none relative focus:outline-none tracking-normal"
      >
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {words.map((word, wordIdx) => {
            const wordChars = word.split('');
            const wordStartIndex = globalCharIndex;
            globalCharIndex += word.length + 1;

            return (
              <span key={wordIdx} className="inline-flex whitespace-nowrap relative">
                {wordChars.map((char, charIdx) => {
                  const absoluteCharIdx = wordStartIndex + charIdx;
                  const isTyped = absoluteCharIdx < typedChars.length;
                  const isCurrent = absoluteCharIdx === typedChars.length;
                  const userChar = typedChars[absoluteCharIdx];
                  const isCorrect = isTyped && userChar === char;
                  const isIncorrect = isTyped && userChar !== char;

                  return (
                    <span
                      key={charIdx}
                      ref={isCurrent ? activeCharRef : null}
                      className={`relative transition-colors duration-75 ${
                        isCurrent
                          ? 'text-[#f5f3f0]'
                          : isCorrect
                          ? 'text-[#f5f3f0]'
                          : isIncorrect
                          ? 'text-[#ef4444] border-b-2 border-[#ef4444]'
                          : 'text-[#8a817a]'
                      }`}
                    >
                      {/* Sleek Cursor */}
                      {isCurrent && (
                        <span
                          className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] bg-[#ff6b00] animate-cursor-blink z-10 shadow-[0_0_8px_#ff6b00]"
                        />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Space between words */}
                {wordIdx < words.length - 1 && (() => {
                  const spaceIdx = wordStartIndex + word.length;
                  const isTyped = spaceIdx < typedChars.length;
                  const isCurrent = spaceIdx === typedChars.length;
                  const userChar = typedChars[spaceIdx];
                  const isIncorrectSpace = isTyped && userChar !== ' ';

                  return (
                    <span
                      key="space"
                      ref={isCurrent ? activeCharRef : null}
                      className={`relative inline-block w-2 text-center ${
                        isIncorrectSpace ? 'border-b-2 border-[#ef4444]' : ''
                      }`}
                    >
                      {isCurrent && (
                        <span
                          className="absolute -left-[1px] top-1 bottom-1 w-[2.5px] bg-[#ff6b00] animate-cursor-blink z-10 shadow-[0_0_8px_#ff6b00]"
                        />
                      )}
                      &nbsp;
                    </span>
                  );
                })()}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sleek Live Stats Bar */}
      <div className="flex items-center justify-center gap-8 sm:gap-14 mt-10 py-5 px-8 bg-[#171411] border border-[#2c241c] rounded-2xl max-w-xl mx-auto shadow-xl shadow-[#ff6b00]/5">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono text-[#ff6b00]">
            {stats.wpm}
          </span>
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-1">
            WPM
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono text-[#ff6b00]">
            {stats.accuracy}%
          </span>
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-1">
            Accuracy
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono text-[#ff6b00]">
            {formatTimeDisplay(timeLeft)}
          </span>
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#8a817a] font-semibold mt-1">
            Time Left
          </span>
        </div>
      </div>
    </div>
  );
};
