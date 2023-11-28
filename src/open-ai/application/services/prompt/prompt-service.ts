import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export interface PromptService {
    getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): string;
    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string;
}
