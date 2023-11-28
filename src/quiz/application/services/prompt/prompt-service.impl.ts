import { PromptService } from './prompt-service';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QUIZ_QUESTIONS_PROMPT } from '../../prompts/quiz-questions-prompt.model';
import { QUIZ_THEMES_PROMPT } from '../../prompts/quiz-themes-prompt.model';

export const NUMBER_OF_THEMES = 15;

export class PromptServiceImpl implements PromptService {
    getQuizQuestionsPrompt(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): string {
        const initialPrompt = QUIZ_QUESTIONS_PROMPT;

        const questionLabels = savedQuizQuestions.map(
            (quizQuestion) => quizQuestion.label,
        );

        return initialPrompt
            .replace('X', numberOfQuestions.toString())
            .replace('#', questionLabels.join(','));
    }

    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string {
        const initialPrompt = QUIZ_THEMES_PROMPT;

        const themeLabels = savedQuizThemes.map((quizTheme) => quizTheme.label);

        return initialPrompt
            .replace('X', NUMBER_OF_THEMES.toString())
            .replace('#', themeLabels.join(','));
    }
}
