import React, { useMemo } from 'react';
// FIX: Import `HistoryEntry` type.
import { Game, GameSettings, HistoryEntry } from '../types';
import { useTypingGame } from '../hooks/useTypingGame';
import Results from './Results';
import { Loader2 } from 'lucide-react';

interface TypingGameProps {
    game: Game;
    settings: GameSettings;
    onGameEnd: (result: Omit<HistoryEntry, 'timestamp'>) => void;
    onRestart: () => void;
}

const TypingGame: React.FC<TypingGameProps> = ({ game, settings, onGameEnd, onRestart }) => {
    const { text, status } = game;
    const { gameState, timeLeft, userInput, charStates, stats, finalResult } = useTypingGame(text, settings, onGameEnd);

    const characters = useMemo(() => {
        return text.split('').map((char, index) => ({
            char,
            state: charStates[index],
        }));
    }, [text, charStates]);

    const { wordStart, wordEnd } = useMemo(() => {
        if (gameState === 'finished') {
            return { wordStart: -1, wordEnd: -1 };
        }
        const cursorPosition = userInput.length;
        
        let start = text.lastIndexOf(' ', cursorPosition - 1);
        start = start === -1 ? 0 : start + 1;

        if (text[cursorPosition - 1] === ' ') {
            start = cursorPosition;
        }

        let end = text.indexOf(' ', start);
        if (end === -1) {
            end = text.length;
        }

        return { wordStart: start, wordEnd: end };
    }, [userInput.length, text, gameState]);


    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-surface rounded-lg shadow-lg w-full">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="mt-4 text-lg font-semibold">Generating fresh text for you...</p>
                <p className="text-gray-500 dark:text-dark-subtle">Hang tight, the AI is thinking!</p>
            </div>
        );
    }
    
    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-surface rounded-lg shadow-lg w-full">
                <p className="mt-4 text-lg font-semibold text-red-500">Oops! Something went wrong.</p>
                <p className="text-gray-500 dark:text-dark-subtle">Using fallback text. Please check your API key or network.</p>
                <button onClick={onRestart} className="mt-6 px-6 py-2 bg-primary text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Try Again
                </button>
            </div>
        );
    }

    if (gameState === 'finished' && finalResult) {
        return <Results result={finalResult} onRestart={onRestart} />;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center space-x-8 mb-6 text-2xl font-semibold text-gray-700 dark:text-dark-text">
                <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-500 dark:text-dark-subtle">WPM</span>
                    <span className="text-primary">{stats.wpm}</span>
                </div>
                <div className="flex flex-col items-center">
                     <span className="text-sm text-gray-500 dark:text-dark-subtle">Accuracy</span>
                    <span>{stats.accuracy}%</span>
                </div>
                 <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-500 dark:text-dark-subtle">Time</span>
                    <span className={timeLeft < 10 ? 'text-red-500' : ''}>{timeLeft}</span>
                </div>
            </div>

            <div className="relative w-full text-2xl lg:text-3xl font-mono leading-relaxed p-6 bg-white dark:bg-dark-surface rounded-lg shadow-lg h-72 overflow-auto focus:outline-none whitespace-pre-wrap tracking-wide" tabIndex={0}>
                <div className="flex flex-wrap" style={{ wordSpacing: '0.25em' }}>
                    {characters.map((item, index) => {
                        const isCurrentWord = gameState !== 'finished' && index >= wordStart && index < wordEnd;
                        return (
                            <span
                                key={index}
                                className={`
                                    ${isCurrentWord ? 'bg-yellow-100 dark:bg-yellow-500/20 rounded-sm' : ''}
                                    ${item.state === 'correct' && 'text-green-500 dark:text-green-400'}
                                    ${item.state === 'incorrect' && 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-sm'}
                                    ${item.state === 'untyped' && 'text-gray-400 dark:text-dark-subtle'}
                                `}
                            >
                                {item.char === ' ' && item.state === 'incorrect' ? '·' : item.char}
                            </span>
                        );
                    })}
                </div>
                 <span
                    className="absolute top-0 left-0 w-1 h-full bg-primary animate-blink"
                    style={{ transform: `translate(${userInput.length}ch, 0)` }}
                />
            </div>
             <p className="mt-6 text-sm text-gray-500 dark:text-dark-subtle">
                {gameState === 'idle' ? 'Start typing to begin the test...' : 'Keep going!'}
            </p>
        </div>
    );
};

export default TypingGame;