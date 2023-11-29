import { ParsedQuizQuestion } from './model/parsed-quiz-question';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';

export interface QuizParser {
    parseQuizQuestions(stringifiedArray: string): ParsedQuizQuestion[];
    parseQuizThemes(stringifiedArray: string): ParsedQuizTheme[];
}
