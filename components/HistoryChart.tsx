
import React from 'react';
import { HistoryEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X } from 'lucide-react';

interface HistoryChartProps {
    history: HistoryEntry[];
    close: () => void;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ history, close }) => {
    const data = history.map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        WPM: entry.wpm,
        Accuracy: entry.accuracy,
    }));

    return (
        <div className="w-full max-w-4xl bg-white dark:bg-dark-surface rounded-lg shadow-xl p-6 relative">
             <button onClick={close} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-bg">
                <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Your Progress</h2>
            {history.length > 1 ? (
                 <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                            <XAxis dataKey="date" stroke="currentColor" />
                            <YAxis yAxisId="left" stroke="#ffc700" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                                    borderColor: '#555',
                                    color: '#eee',
                                }}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="WPM" stroke="#ffc700" activeDot={{ r: 8 }} />
                            <Line yAxisId="right" type="monotone" dataKey="Accuracy" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-dark-subtle py-20">
                    Complete a few more tests to see your progress chart!
                </p>
            )}
        </div>
    );
};

export default HistoryChart;
