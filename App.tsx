
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Game, GameMode, GameSettings, HistoryEntry } from './types';
import TypingGame from './components/TypingGame';
import Settings from './components/Settings';
import HistoryChart from './components/HistoryChart';
import { generateTypingText } from './services/geminiService';
import { Sun, Moon, Github, Settings as SettingsIcon, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        const savedHistory = localStorage.getItem('typingHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [settings, setSettings] = useState<GameSettings>({
        duration: 60,
        mode: GameMode.ADVANCED,
    });
    const [game, setGame] = useState<Game>({
        id: Date.now(),
        text: '',
        status: 'loading',
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [ai, setAi] = useState<GoogleGenAI | null>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const startNewGame = useCallback(async () => {
        if (!ai) {
            setGame({
                id: Date.now(),
                text: "API Key not configured. Please set the API_KEY environment variable.",
                status: 'ready'
            });
            return;
        }
        setGame(g => ({ ...g, status: 'loading' }));
        try {
            const newText = await generateTypingText(ai, settings.mode, settings.duration);
            setGame({
                id: Date.now(),
                text: newText,
                status: 'ready',
            });
        } catch (error) {
            console.error("Failed to generate text:", error);
            setGame({
                id: Date.now(),
                text: "The quick brown fox jumps over the lazy dog.",
                status: 'error',
            });
        }
    }, [ai, settings.mode, settings.duration]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    const handleGameEnd = (result: Omit<HistoryEntry, 'timestamp'>) => {
        const newEntry: HistoryEntry = { ...result, timestamp: Date.now() };
        const updatedHistory = [...history, newEntry];
        setHistory(updatedHistory);
        localStorage.setItem('typingHistory', JSON.stringify(updatedHistory));
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-dark-text bg-gray-100 dark:bg-dark-bg font-sans transition-colors duration-300 flex flex-col items-center p-4 sm:p-6 md:p-8">
            <header className="w-full max-w-5xl flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center">
                    <span className="text-primary mr-2">Typo</span>Titan
                </h1>
                <nav className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    <button onClick={() => setIsHistoryOpen(s => !s)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors">
                        <BarChart2 size={20} />
                    </button>
                    <button onClick={() => setIsSettingsOpen(s => !s)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors">
                        <SettingsIcon size={20} />
                    </button>
                     <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-surface transition-colors">
                        <Github size={20} />
                    </a>
                </nav>
            </header>

            <main className="w-full max-w-5xl flex-grow flex flex-col items-center justify-center">
                {isSettingsOpen ? (
                    <Settings settings={settings} setSettings={setSettings} close={() => setIsSettingsOpen(false)} />
                ) : isHistoryOpen ? (
                     <HistoryChart history={history} close={() => setIsHistoryOpen(false)} />
                ) : (
                    <TypingGame key={game.id} game={game} settings={settings} onGameEnd={handleGameEnd} onRestart={startNewGame} />
                )}
            </main>
            
            <footer className="w-full max-w-5xl text-center mt-8 text-sm text-gray-500 dark:text-dark-subtle">
                <p>Built with React, TypeScript, Tailwind CSS, and Gemini API.</p>
                <div className="mt-4 h-16 w-full max-w-2xl bg-gray-200 dark:bg-dark-surface rounded-lg flex items-center justify-center text-gray-400 dark:text-dark-subtle">
                    Ad Placeholder (e.g., Google AdSense)
                </div>
            </footer>
        </div>
    );
};

export default App;
