import { ApiService } from '../../../open-ai/application/services/api/api-service';
import { GetQuizParametersHandler } from './get-quiz-parameters.handler';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { ParsedQuizTheme } from '../quiz-parser/model/parsed-quiz-theme';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { ParsedQuizQuestion } from '../quiz-parser/model/parsed-quiz-question';

describe('GetQuizParametersHandler', () => {
    let sut: GetQuizParametersHandler;

    let apiServiceSpy: ApiServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizThemeRepoSpy: QuizThemeRepositorySpy;

    beforeEach(() => {
        apiServiceSpy = new ApiServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizThemeRepoSpy = new QuizThemeRepositorySpy();

        sut = new GetQuizParametersHandler(
            apiServiceSpy,
            openAIServiceSpy,
            quizThemeRepoSpy,
        );
    });

    describe('execute', () => {
        it('should retrieve existing quiz themes from database anyway', async () => {
            await sut.execute();

            expect(quizThemeRepoSpy.calls.getQuizThemes.count).toBe(1);
        });

        it('should directly return existing quiz themes if OpenAI API request CANNOT be made', async () => {
            const existingThemes: QuizTheme[] = [
                new QuizTheme('id1', 'code1', 'label1'),
                new QuizTheme('id2', 'code2', 'label2'),
                new QuizTheme('id3', 'code3', 'label3'),
            ];

            stubGetQuizThemes(quizThemeRepoSpy, existingThemes);
            stubCannotGenerateQuizThemes(apiServiceSpy, true);

            const result = await sut.execute();

            expect(apiServiceSpy.calls.cannotGenerateQuizThemes.count).toBe(1);
            expect(result.themes).toEqual(existingThemes);
        });

        it('should generate new quiz themes if OpenAI API request CAN be made', async () => {
            const existingThemes: QuizTheme[] = [
                new QuizTheme('id1', 'code1', 'label1'),
                new QuizTheme('id2', 'code2', 'label2'),
                new QuizTheme('id3', 'code3', 'label3'),
            ];

            stubGetQuizThemes(quizThemeRepoSpy, existingThemes);
            stubCannotGenerateQuizThemes(apiServiceSpy, false);

            await sut.execute();

            expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(1);
        });

        it('should return both existing and generated quiz themes once request has been made', async () => {
            const existingThemes: QuizTheme[] = [
                new QuizTheme('id1', 'code1', 'label1'),
                new QuizTheme('id2', 'code2', 'label2'),
                new QuizTheme('id3', 'code3', 'label3'),
            ];

            const generatedThemes: ParsedQuizTheme[] = [
                new ParsedQuizTheme('codeA', 'labelA'),
                new ParsedQuizTheme('codeB', 'labelB'),
                new ParsedQuizTheme('codeC', 'labelC'),
            ];

            const savedGeneratedThemes = mapToQuizThemes(generatedThemes);

            stubGetQuizThemes(quizThemeRepoSpy, existingThemes);
            stubCannotGenerateQuizThemes(apiServiceSpy, false);
            stubGenerateThemesForQuiz(openAIServiceSpy, generatedThemes);
            stubSaveGeneratedThemes(quizThemeRepoSpy, savedGeneratedThemes);

            const result = await sut.execute();

            expect(quizThemeRepoSpy.calls.saveGeneratedThemes.count).toBe(1);
            expect(
                quizThemeRepoSpy.calls.saveGeneratedThemes.history,
            ).toContainEqual(generatedThemes);

            const existingAndSavedThemes = [
                ...existingThemes,
                ...savedGeneratedThemes,
            ];

            expect(result.themes).toEqual(existingAndSavedThemes);
        });

        it('should indicate that an OpenAI API request has been made', async () => {
            stubGetQuizThemes(quizThemeRepoSpy, []);
            stubCannotGenerateQuizThemes(apiServiceSpy, false);
            stubGenerateThemesForQuiz(openAIServiceSpy, []);
            stubSaveGeneratedThemes(quizThemeRepoSpy, []);

            await sut.execute();

            expect(apiServiceSpy.calls.flagQuizThemeRequest.count).toBe(1);
        });
    });
});

class ApiServiceSpy implements ApiService {
    calls = {
        cannotGenerateQuizThemes: {
            count: 0,
        },
        flagQuizThemeRequest: {
            count: 0,
        },
    };

    cannotGenerateQuizQuestions(): boolean {
        throw new Error('Method not implemented.');
    }

    cannotGenerateQuizThemes(): boolean {
        this.calls.cannotGenerateQuizThemes.count++;
        return true;
    }

    flagQuizQuestionRequest(): void {
        throw new Error('Method not implemented.');
    }

    flagQuizThemeRequest(): void {
        this.calls.flagQuizThemeRequest.count++;
    }
}

function stubCannotGenerateQuizThemes(
    apiServiceSpy: ApiServiceSpy,
    returnedValue: boolean,
): void {
    apiServiceSpy.cannotGenerateQuizThemes = () => {
        apiServiceSpy.calls.cannotGenerateQuizThemes.count++;
        return returnedValue;
    };
}

class OpenAIServiceSpy implements OpenAIService {
    calls = {
        generateThemesForQuiz: {
            count: 0,
            history: [] as QuizTheme[][],
        },
    };

    generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> {
        return Promise.resolve([]);
    }

    generateThemesForQuiz(
        savedQuizThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]> {
        this.calls.generateThemesForQuiz.count++;
        this.calls.generateThemesForQuiz.history.push(savedQuizThemes);
        return Promise.resolve([]);
    }
}

function stubGenerateThemesForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: ParsedQuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): Promise<ParsedQuizTheme[]> => {
        openAIServiceSpy.calls.generateThemesForQuiz.count++;
        return Promise.resolve(returnedValue);
    };
}

class QuizThemeRepositorySpy implements QuizThemeRepository {
    calls = {
        getQuizThemes: {
            count: 0,
        },
        saveGeneratedThemes: {
            count: 0,
            history: [] as ParsedQuizTheme[][],
        },
    };

    async getQuizTheme(themeId: string): Promise<QuizTheme | null> {
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

function stubGetQuizThemes(
    quizThemeRepoSpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepoSpy.getQuizThemes = (): Promise<QuizTheme[]> => {
        quizThemeRepoSpy.calls.getQuizThemes.count++;
        return Promise.resolve(returnedValue);
    };
}

function stubSaveGeneratedThemes(
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

function mapToQuizThemes(generatedThemes: ParsedQuizTheme[]): QuizTheme[] {
    return generatedThemes.map(
        (parsedTheme) =>
            new QuizTheme('id', parsedTheme.code, parsedTheme.label),
    );
}
