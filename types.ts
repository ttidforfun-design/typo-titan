
export enum GameMode {
    BEGINNER = 'Beginner (Simple Words)',
    ADVANCED = 'Advanced (Paragraphs)',
}

export interface GameSettings {
    duration: 30 | 60 | 90 | 120;
    mode: GameMode;
}

export interface Game {
    id: number;
    text: string;
    status: 'loading' | 'ready' | 'error';
}

export interface GameResult {
    wpm: number;
    cpm: number;
    accuracy: number;
    rawWpm: number;
}

export interface HistoryEntry extends GameResult {
    timestamp: number;
    duration: number;
    mode: GameMode;
}

export type CharState = 'untyped' | 'correct' | 'incorrect';
