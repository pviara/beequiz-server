import { QuizTheme } from 'src/quiz/domain/quiz-parameters';
import { PromptService } from './prompt-service';
import { readFileSync } from 'fs';

export class PromptServiceImpl implements PromptService {
    getQuizThemesPrompt(savedQuizThemes: QuizTheme[]): string {
        const initialPrompt = readFileSync(
            '../prompts/quiz-themes-prompt.model.txt',
        ).toString();

        const themeLabels = savedQuizThemes.map((quizTheme) => quizTheme.label);

        return initialPrompt
            .replace('X', '15')
            .replace('#', themeLabels.join(','));
    }
}
