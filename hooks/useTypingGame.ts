
import { useState, useEffect, useCallback, useRef } from 'react';
// FIX: Import `HistoryEntry` type.
import { GameSettings, GameResult, CharState, HistoryEntry } from '../types';

export const useTypingGame = (
    text: string,
    settings: GameSettings,
    onGameEnd: (result: Omit<HistoryEntry, 'timestamp'>) => void
) => {
    const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
    const [timeLeft, setTimeLeft] = useState(settings.duration);
    const [userInput, setUserInput] = useState('');
    const [charStates, setCharStates] = useState<CharState[]>(() => Array(text.length).fill('untyped'));

    const [stats, setStats] = useState<GameResult>({ wpm: 0, cpm: 0, accuracy: 0, rawWpm: 0 });
    const [finalResult, setFinalResult] = useState<GameResult | null>(null);

    // FIX: Use `number` for timer ID in browser environments instead of `NodeJS.Timeout`.
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const totalTypedCharsRef = useRef(0);
    const correctTypedCharsRef = useRef(0);
    
    const keypressAudioRef = useRef<HTMLAudioElement | null>(null);
    if (typeof Audio !== 'undefined' && !keypressAudioRef.current) {
        keypressAudioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_bd78bce067.mp3?filename=keyboard-typing-37332.mp3');
        keypressAudioRef.current.volume = 0.5;
    }

    const calculateStats = useCallback(() => {
        const elapsedSeconds = (Date.now() - (startTimeRef.current ?? Date.now())) / 1000;
        if (elapsedSeconds === 0) return { wpm: 0, cpm: 0, accuracy: 100, rawWpm: 0 };

        const typedWords = totalTypedCharsRef.current / 5;
        const correctWords = correctTypedCharsRef.current / 5;
        const minutes = elapsedSeconds / 60;
        
        const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;
        const cpm = minutes > 0 ? Math.round(correctTypedCharsRef.current / minutes) : 0;
        const rawWpm = minutes > 0 ? Math.round(typedWords / minutes) : 0;
        const accuracy = totalTypedCharsRef.current > 0 ? Math.round((correctTypedCharsRef.current / totalTypedCharsRef.current) * 100) : 100;

        return { wpm, cpm, accuracy, rawWpm };
    }, []);

    const endGame = useCallback(() => {
        if (gameState !== 'running') return;
        setGameState('finished');
        if (timerRef.current) clearInterval(timerRef.current);
        const finalStats = calculateStats();
        setFinalResult(finalStats);
        setStats(finalStats);
        onGameEnd({ ...finalStats, duration: settings.duration, mode: settings.mode });
    }, [gameState, calculateStats, onGameEnd, settings.duration, settings.mode]);

    useEffect(() => {
        if (gameState === 'running') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    setStats(calculateStats());
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, endGame, calculateStats]);

    const startGame = () => {
        setGameState('running');
        setTimeLeft(settings.duration);
        setUserInput('');
        setCharStates(Array(text.length).fill('untyped'));
        setStats({ wpm: 0, cpm: 0, accuracy: 100, rawWpm: 0 });
        setFinalResult(null);
        startTimeRef.current = Date.now();
        totalTypedCharsRef.current = 0;
        correctTypedCharsRef.current = 0;
    };
    
    const handleKeyPress = useCallback((key: string) => {
        if (gameState === 'finished') return;
        if (gameState === 'idle') {
            startGame();
        }

        if (keypressAudioRef.current) {
            keypressAudioRef.current.currentTime = 0;
            keypressAudioRef.current.play().catch(e => console.error("Audio play failed", e));
        }

        if (key === 'Backspace') {
            if (userInput.length > 0) {
                setUserInput(prev => prev.slice(0, -1));
                 setCharStates(prev => {
                    const newStates = [...prev];
                    newStates[userInput.length - 1] = 'untyped';
                    return newStates;
                });
            }
        } else if (key.length === 1 && userInput.length < text.length) {
            totalTypedCharsRef.current++;
            const newCharStates = [...charStates];
            const currentIndex = userInput.length;
            
            if (key === text[currentIndex]) {
                newCharStates[currentIndex] = 'correct';
                correctTypedCharsRef.current++;
            } else {
                newCharStates[currentIndex] = 'incorrect';
            }
            setCharStates(newCharStates);
            setUserInput(prev => prev + key);
            
            if (userInput.length + 1 === text.length) {
                endGame();
            }
        }
    }, [gameState, userInput, text, charStates, endGame]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.key.length === 1 || e.key === 'Backspace') {
                handleKeyPress(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyPress]);

    return { gameState, timeLeft, userInput, charStates, stats, finalResult };
};
