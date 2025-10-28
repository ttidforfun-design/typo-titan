
import React from 'react';
import { GameSettings, GameMode } from '../types';
import { X } from 'lucide-react';

interface SettingsProps {
    settings: GameSettings;
    setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
    close: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, close }) => {
    const handleDurationChange = (duration: GameSettings['duration']) => {
        setSettings(prev => ({ ...prev, duration }));
    };

    const handleModeChange = (mode: GameMode) => {
        setSettings(prev => ({ ...prev, mode }));
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 relative">
             <button onClick={close} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-bg">
                <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            
            <div className="mb-6">
                <h3 className="font-semibold mb-2">Game Duration (seconds)</h3>
                <div className="flex space-x-2">
                    {([30, 60, 90, 120] as const).map(duration => (
                        <button
                            key={duration}
                            onClick={() => handleDurationChange(duration)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                settings.duration === duration
                                    ? 'bg-primary text-gray-900'
                                    : 'bg-gray-200 dark:bg-dark-bg hover:bg-gray-300 dark:hover:bg-opacity-80'
                            }`}
                        >
                            {duration}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Game Mode</h3>
                <div className="flex flex-col space-y-2">
                    {Object.values(GameMode).map(mode => (
                        <button
                            key={mode}
                            onClick={() => handleModeChange(mode)}
                            className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                                settings.mode === mode
                                    ? 'bg-primary text-gray-900'
                                    : 'bg-gray-200 dark:bg-dark-bg hover:bg-gray-300 dark:hover:bg-opacity-80'
                            }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
