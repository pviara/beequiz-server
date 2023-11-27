import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';

export interface PromptService {
    getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): string;
    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string;
}
