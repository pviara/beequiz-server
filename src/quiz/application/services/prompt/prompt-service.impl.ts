import { QuizTheme } from 'src/quiz/domain/quiz-parameters';
import { PromptService } from './prompt-service';
import { readFileSync } from 'fs';
import { QuizQuestion } from 'src/quiz/domain/quiz-question';

export const NUMBER_OF_THEMES = 15;

export class PromptServiceImpl implements PromptService {
    getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): string {
        const initialPrompt = readFileSync(
            '../prompts/quiz-questions-prompt.model.txt',
        ).toString();

        const questionLabels = savedQuizQuestions.map(
            (quizQuestion) => quizQuestion.label,
        );

        return initialPrompt
            .replace('X', numberOfQuestions.toString())
            .replace('#', questionLabels.join(','));
    }

    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string {
        const initialPrompt = readFileSync(
            '../prompts/quiz-themes-prompt.model.txt',
        ).toString();

        const themeLabels = savedQuizThemes.map((quizTheme) => quizTheme.label);

        return initialPrompt
            .replace('X', NUMBER_OF_THEMES.toString())
            .replace('#', themeLabels.join(','));
    }
}
