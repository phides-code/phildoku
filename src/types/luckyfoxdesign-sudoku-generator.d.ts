declare module '@luckyfoxdesign/sudoku-generator' {
    export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

    export type GeneratedSudoku = {
        puzzle: number[][];
        solution: number[][];
        difficulty: SudokuDifficulty;
        score: number;
    };

    export function generateSudoku(
        difficulty?: SudokuDifficulty,
    ): GeneratedSudoku;

    export function generateCompleteSudokuGrid(): number[][];

    export function generateSudokuGrid(): number[][];
}
