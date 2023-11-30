import { ParsedQuizTheme } from '../../quiz-parser/model/parsed-quiz-theme';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';

export class QuizThemeRepositorySpy implements QuizThemeRepository {
    calls = {
        getQuizTheme: {
            count: 0,
            history: [] as string[],
        },
        getQuizThemes: {
            count: 0,
        },
        saveGeneratedThemes: {
            count: 0,
            history: [] as ParsedQuizTheme[][],
        },
    };

    async getQuizTheme(themeId: string): Promise<QuizTheme | null> {
        this.calls.getQuizTheme.count++;
        this.calls.getQuizTheme.history.push(themeId);
        return null;
    }

    async getQuizThemes(): Promise<QuizTheme[]> {
        this.calls.getQuizThemes.count++;
        return [];
    }

    async saveGeneratedThemes(quizThemes: QuizTheme[]): Promise<QuizTheme[]> {
        this.calls.saveGeneratedThemes.count++;
        this.calls.saveGeneratedThemes.history.push(quizThemes);
        return [];
    }
}

export function stubGetQuizTheme(
    quizThemeRepoSpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme | null,
): void {
    quizThemeRepoSpy.getQuizTheme = (
        themeId: string,
    ): Promise<QuizTheme | null> => {
        quizThemeRepoSpy.calls.getQuizTheme.count++;
        quizThemeRepoSpy.calls.getQuizTheme.history.push(themeId);
        return Promise.resolve(returnedValue);
    };
}

export function stubGetQuizThemes(
    quizThemeRepoSpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepoSpy.getQuizThemes = (): Promise<QuizTheme[]> => {
        quizThemeRepoSpy.calls.getQuizThemes.count++;
        return Promise.resolve(returnedValue);
    };
}

export function stubSaveGeneratedThemes(
    quizThemeRepositorySpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepositorySpy.saveGeneratedThemes = (
        quizThemes: ParsedQuizTheme[],
    ): Promise<QuizTheme[]> => {
        quizThemeRepositorySpy.calls.saveGeneratedThemes.count++;
        quizThemeRepositorySpy.calls.saveGeneratedThemes.history.push(
            quizThemes,
        );
        return Promise.resolve(returnedValue);
    };
}

export function mapToQuizThemes(
    generatedThemes: ParsedQuizTheme[],
): QuizTheme[] {
    return generatedThemes.map(
        (parsedTheme) =>
            new QuizTheme('id', parsedTheme.code, parsedTheme.label),
    );
}
