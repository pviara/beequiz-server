import { QuizQuestion } from '../../domain/quiz-question';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';

export interface QuizParser {
    parseQuizQuestions(stringifiedArray: string): QuizQuestion[];
    parseQuizThemes(stringifiedArray: string): ParsedQuizTheme[];
}
