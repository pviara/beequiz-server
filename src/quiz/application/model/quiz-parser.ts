import { QuizQuestion } from '../../domain/quiz-question';
import { QuizTheme } from '../../domain/quiz-parameters';

export interface QuizParser {
    parseQuizQuestions(stringifiedObject: string): QuizQuestion[];
    parseQuizThemes(stringifiedObject: string): QuizTheme[];
}
