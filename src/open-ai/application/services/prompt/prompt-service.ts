import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export abstract class PromptService {
    abstract getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): string;

    abstract getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string;
}
