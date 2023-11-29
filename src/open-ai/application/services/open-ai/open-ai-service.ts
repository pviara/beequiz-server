import { ParsedQuizQuestion } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-question';
import { ParsedQuizTheme } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-theme';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export interface OpenAIService {
    generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<ParsedQuizQuestion[]>;
    generateThemesForQuiz(
        savedQuizThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]>;
}
