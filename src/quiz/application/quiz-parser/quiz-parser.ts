import { QuizQuestion } from '../../domain/quiz-question';
import { QuizTheme } from '../../domain/quiz-parameters';

export interface QuizParser {
    parseQuizQuestions(stringifiedArray: string): QuizQuestion[];
    parseQuizThemes(stringifiedArray: string): QuizTheme[];
}
