
import React from 'react';
import { GameResult } from '../types';
import { RefreshCw } from 'lucide-react';

interface ResultsProps {
    result: GameResult;
    onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onRestart }) => {
    return (
        <div className="w-full max-w-2xl bg-white dark:bg-dark-surface rounded-lg shadow-xl p-8 text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-primary mb-4">Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-8">
                <div className="p-4 bg-gray-100 dark:bg-dark-bg rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-dark-subtle">WPM</p>
                    <p className="text-4xl font-bold text-primary">{result.wpm}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-dark-bg rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-dark-subtle">Accuracy</p>
                    <p className="text-4xl font-bold">{result.accuracy}%</p>
                </div>
                 <div className="p-4 bg-gray-100 dark:bg-dark-bg rounded-lg col-span-2 md:col-span-1">
                    <p className="text-sm text-gray-500 dark:text-dark-subtle">CPM</p>
                    <p className="text-4xl font-bold">{result.cpm}</p>
                </div>
            </div>
            <button
                onClick={onRestart}
                className="mt-4 px-6 py-3 bg-primary text-gray-900 font-bold rounded-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
            >
                <RefreshCw size={20} className="mr-2" />
                <span>Try Again</span>
            </button>
        </div>
    );
};

export default Results;
