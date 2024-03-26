import { ParsedQuizQuestion } from './model/parsed-quiz-question';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';

export abstract class QuizParser {
    abstract parseQuizQuestions(stringifiedArray: string): ParsedQuizQuestion[];
    abstract parseQuizThemes(stringifiedArray: string): ParsedQuizTheme[];
}
