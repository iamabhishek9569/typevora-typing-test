import React, { useState, useEffect, useCallback } from 'react';
import { Difficulty, TestResult, TestSettings } from './types';
import { getGeneratedTextForDuration } from './data/texts';
import {
  loadStoredHistory,
  saveResultToHistory,
  loadStoredSettings,
  saveStoredSettings,
} from './utils/calculateWpm';
import { Header } from './components/Header';
import { TestConfigBar } from './components/TestConfigBar';
import { TypingArea } from './components/TypingArea';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { soundEngine } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState<'test' | 'history' | 'about'>('test');
  const [settings, setSettings] = useState<TestSettings>(() => loadStoredSettings());
  const [history, setHistory] = useState<TestResult[]>(() => loadStoredHistory());
  const [currentText, setCurrentText] = useState<string>('');
  const [lastResult, setLastResult] = useState<TestResult | null>(null);
  const [isTypingActive, setIsTypingActive] = useState<boolean>(false);
  const [testSessionKey, setTestSessionKey] = useState<number>(0);

  // Initialize and generate text
  const generateNewText = useCallback(
    (diff = settings.difficulty, dur = settings.duration) => {
      const text = getGeneratedTextForDuration(diff, dur);
      setCurrentText(text);
      setLastResult(null);
      setTestSessionKey((prev) => prev + 1);
      setIsTypingActive(false);
    },
    [settings.difficulty, settings.duration]
  );

  useEffect(() => {
    generateNewText();
  }, []);

  // Update duration
  const handleSelectDuration = (duration: number) => {
    const updated = { ...settings, duration };
    setSettings(updated);
    saveStoredSettings(updated);
    generateNewText(settings.difficulty, duration);
  };

  // Update difficulty
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    const updated = { ...settings, difficulty };
    setSettings(updated);
    saveStoredSettings(updated);
    generateNewText(difficulty, settings.duration);
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    const updated = { ...settings, soundEnabled: nextVal };
    setSettings(updated);
    saveStoredSettings(updated);
    if (nextVal) {
      soundEngine.init();
      soundEngine.playKeyClick('char');
    }
  };

  // Restart current test session
  const handleRestart = () => {
    setLastResult(null);
    setTestSessionKey((prev) => prev + 1);
    setIsTypingActive(false);
    setActiveTab('test');
  };

  // Complete test handler
  const handleFinishTest = (result: TestResult) => {
    setLastResult(result);
    const updatedHistory = saveResultToHistory(result);
    setHistory(updatedHistory);
    setIsTypingActive(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#e4e4e7] font-sans antialiased relative selection:bg-[#f59e0b]/25 selection:text-[#f59e0b]">
      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        historyCount={history.length}
        isTypingActive={isTypingActive && activeTab === 'test' && !lastResult}
        onQuickRestart={handleRestart}
      />

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col justify-center max-w-[800px] w-full mx-auto px-4 sm:px-6 py-4">
        {activeTab === 'test' && (
          <div className="w-full">
            {/* Sleek Hero Subtitle & Time Selector */}
            {!lastResult && (
              <div
                className={`text-center transition-all duration-300 ${
                  isTypingActive ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 mb-6'
                }`}
              >
                <h1 className="text-lg text-[#71717a] font-normal mb-4">
                  Test your typing speed.
                </h1>

                <TestConfigBar
                  selectedDuration={settings.duration}
                  onSelectDuration={handleSelectDuration}
                  selectedDifficulty={settings.difficulty}
                  onSelectDifficulty={handleSelectDifficulty}
                  onRestart={handleRestart}
                  onNewText={() => generateNewText(settings.difficulty, settings.duration)}
                  disabled={isTypingActive}
                  isTypingActive={isTypingActive}
                />
              </div>
            )}

            {/* Typing Test Area or Results Screen */}
            {lastResult ? (
              <ResultsView
                result={lastResult}
                onRestart={handleRestart}
                onNewText={() => generateNewText(settings.difficulty, settings.duration)}
                onViewHistory={() => setActiveTab('history')}
              />
            ) : (
              currentText && (
                <TypingArea
                  key={testSessionKey}
                  targetText={currentText}
                  duration={settings.duration}
                  difficulty={settings.difficulty}
                  soundEnabled={settings.soundEnabled}
                  onFinish={handleFinishTest}
                  onRestart={handleRestart}
                  isTypingActive={isTypingActive}
                  setIsTypingActive={setIsTypingActive}
                />
              )
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onBackToTest={() => setActiveTab('test')}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onBackToTest={() => setActiveTab('test')} />
        )}
      </main>

      {/* Sleek Footer */}
      <Footer isTypingActive={isTypingActive && activeTab === 'test' && !lastResult} />
    </div>
  );
}
