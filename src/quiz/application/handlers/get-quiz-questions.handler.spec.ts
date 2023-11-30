import { ApiService } from '../../../open-ai/application/services/api/api-service';
import {
    GetQuizQuestionsCommand,
    GetQuizQuestionsHandler,
} from './get-quiz-questions.handler';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { ParsedQuizQuestion } from '../quiz-parser/model/parsed-quiz-question';
import { QuizAnswer, QuizQuestion } from '../../domain/quiz-question';
import { QuizQuestionRepository } from '../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeNotFoundException } from '../errors/quiz-theme-not-found.exception';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { ParsedQuizTheme } from '../quiz-parser/model/parsed-quiz-theme';

describe('GetQuizQuestionsHandler', () => {
    let sut: GetQuizQuestionsHandler;

    let apiServiceSpy: ApiServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizQuestionRepoSpy: QuizQuestionRepositorySpy;
    let quizThemeRepoSpy: QuizThemeRepositorySpy;

    const existingQuestions: QuizQuestion[] = [
        new QuizQuestion('id1', 'label1', []),
        new QuizQuestion('id2', 'label2', []),
        new QuizQuestion('id3', 'label3', []),
    ];

    const existingTheme = new QuizTheme('id', 'code', 'label');

    const generatedQuestions: ParsedQuizQuestion[] = [
        new ParsedQuizQuestion('label1', []),
        new ParsedQuizQuestion('label2', []),
        new ParsedQuizQuestion('label3', []),
    ];

    beforeEach(() => {
        apiServiceSpy = new ApiServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizQuestionRepoSpy = new QuizQuestionRepositorySpy();
        quizThemeRepoSpy = new QuizThemeRepositorySpy();

        sut = new GetQuizQuestionsHandler(
            apiServiceSpy,
            openAIServiceSpy,
            quizQuestionRepoSpy,
            quizThemeRepoSpy,
        );
    });

    describe('execute', () => {
        it('should retrieve quiz related theme using given themeId', async () => {
            const command = new GetQuizQuestionsCommand(5, existingTheme.id);

            stubGetQuizTheme(quizThemeRepoSpy, existingTheme);

            await sut.execute(command);

            expect(quizThemeRepoSpy.calls.getQuizTheme.count).toBe(1);
            expect(quizThemeRepoSpy.calls.getQuizTheme.history).toContain(
                command.themeId,
            );
        });

        it('should throw an error when no quiz related theme is found', async () => {
            const command = new GetQuizQuestionsCommand(5, 'theme_id');

            stubGetQuizTheme(quizThemeRepoSpy, null);

            await expect(sut.execute(command)).rejects.toThrow(
                QuizThemeNotFoundException,
            );
        });

        it('should retrieve existing quiz themes from database anyway', async () => {
            const command = new GetQuizQuestionsCommand(5, existingTheme.id);

            stubGetQuizTheme(quizThemeRepoSpy, existingTheme);

            await sut.execute(command);

            expect(quizQuestionRepoSpy.calls.getQuizQuestions.count).toBe(1);
            expect(
                quizQuestionRepoSpy.calls.getQuizQuestions.history,
            ).toContain(existingTheme.id);
        });

        describe('OpenAI API request cannot be made', () => {
            beforeEach(() => {
                stubGetQuizTheme(quizThemeRepoSpy, existingTheme);
                stubCannotGenerateQuizQuestions(apiServiceSpy, true);
            });

            it('should directly return existing questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGetQuizQuestions(quizQuestionRepoSpy, existingQuestions);

                const result = await sut.execute(command);

                expect(
                    apiServiceSpy.calls.cannotGenerateQuizQuestions.count,
                ).toBe(1);

                expect(result).toEqual(existingQuestions);
            });

            it('should still generate new quiz questions when there are not enough', async () => {
                const command = new GetQuizQuestionsCommand(
                    3,
                    existingTheme.id,
                );

                const slicedQuestions = existingQuestions.slice(2);

                stubGetQuizQuestions(quizQuestionRepoSpy, slicedQuestions);

                await sut.execute(command);

                expect(
                    apiServiceSpy.calls.cannotGenerateQuizQuestions.count,
                ).toBe(1);

                expect(
                    openAIServiceSpy.calls.generateQuestionsForQuiz.count,
                ).toBe(1);

                expect(
                    openAIServiceSpy.calls.generateQuestionsForQuiz.history,
                ).toContainEqual([
                    slicedQuestions,
                    command.numberOfQuestions,
                    existingTheme.label,
                ]);

                expect(apiServiceSpy.calls.flagQuizQuestionRequest.count).toBe(
                    1,
                );
            });
        });

        describe('OpenAI API request can be made', () => {
            beforeEach(() => {
                stubGetQuizTheme(quizThemeRepoSpy, existingTheme);
                stubCannotGenerateQuizQuestions(apiServiceSpy, false);
                stubGetQuizQuestions(quizQuestionRepoSpy, existingQuestions);
            });

            it('should save generated questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGenerateQuestionsForQuiz(
                    openAIServiceSpy,
                    generatedQuestions,
                );

                await sut.execute(command);

                expect(
                    quizQuestionRepoSpy.calls.saveGeneratedQuestions.count,
                ).toBe(1);

                expect(
                    quizQuestionRepoSpy.calls.saveGeneratedQuestions.history,
                ).toContainEqual([generatedQuestions, existingTheme.id]);
            });

            it('should only return generated questions', async () => {
                const command = new GetQuizQuestionsCommand(
                    existingQuestions.length,
                    existingTheme.id,
                );

                stubGenerateQuestionsForQuiz(
                    openAIServiceSpy,
                    generatedQuestions,
                );

                const savedQuestions = mapToQuizQuestions(generatedQuestions);
                stubSaveGeneratedQuestions(quizQuestionRepoSpy, savedQuestions);

                const result = await sut.execute(command);

                expect(result).toEqual(savedQuestions);
            });
        });
    });
});

class ApiServiceSpy implements ApiService {
    calls = {
        cannotGenerateQuizQuestions: {
            count: 0,
        },
        flagQuizQuestionRequest: {
            count: 0,
        },
    };

    cannotGenerateQuizQuestions(): boolean {
        this.calls.cannotGenerateQuizQuestions.count++;
        return true;
    }

    cannotGenerateQuizThemes(): boolean {
        return true;
    }

    flagQuizQuestionRequest(): void {
        this.calls.flagQuizQuestionRequest.count++;
    }

    flagQuizThemeRequest(): void {}
}

function stubCannotGenerateQuizQuestions(
    apiServiceSpy: ApiServiceSpy,
    returnedValue: boolean,
): void {
    apiServiceSpy.cannotGenerateQuizQuestions = () => {
        apiServiceSpy.calls.cannotGenerateQuizQuestions.count++;
        return returnedValue;
    };
}

class OpenAIServiceSpy implements OpenAIService {
    calls = {
        generateQuestionsForQuiz: {
            count: 0,
            history: [] as [QuizQuestion[], number, string][],
        },
    };

    async generateQuestionsForQuiz(
        existingQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> {
        this.calls.generateQuestionsForQuiz.count++;
        this.calls.generateQuestionsForQuiz.history.push([
            existingQuestions,
            numberOfQuestions,
            themeLabel,
        ]);
        return [];
    }

    async generateThemesForQuiz(
        existingThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]> {
        return [];
    }
}

function stubGenerateQuestionsForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: ParsedQuizQuestion[],
): void {
    openAIServiceSpy.generateQuestionsForQuiz = (
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> => {
        openAIServiceSpy.calls.generateQuestionsForQuiz.count++;
        openAIServiceSpy.calls.generateQuestionsForQuiz.history.push([
            savedQuizQuestions,
            numberOfQuestions,
            themeLabel,
        ]);
        return Promise.resolve(returnedValue);
    };
}

class QuizQuestionRepositorySpy implements QuizQuestionRepository {
    calls = {
        getQuizQuestions: {
            count: 0,
            history: [] as string[],
        },
        saveGeneratedQuestions: {
            count: 0,
            history: [] as [ParsedQuizQuestion[], string][],
        },
    };

    async getQuizQuestions(themeId: string): Promise<QuizQuestion[]> {
        this.calls.getQuizQuestions.count++;
        this.calls.getQuizQuestions.history.push(themeId);
        return [];
    }

    async saveGeneratedQuestions(
        generatedQuestions: ParsedQuizQuestion[],
        themeId: string,
    ): Promise<QuizQuestion[]> {
        this.calls.saveGeneratedQuestions.count++;
        this.calls.saveGeneratedQuestions.history.push([
            generatedQuestions,
            themeId,
        ]);
        return [];
    }
}

function stubGetQuizQuestions(
    quizQuestionRepoSpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepoSpy.getQuizQuestions = (): Promise<QuizQuestion[]> => {
        quizQuestionRepoSpy.calls.getQuizQuestions.count++;
        return Promise.resolve(returnedValue);
    };
}

function stubSaveGeneratedQuestions(
    quizQuestionRepoSpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepoSpy.saveGeneratedQuestions = (
        quizQuestions: ParsedQuizQuestion[],
        themeId: string,
    ): Promise<QuizQuestion[]> => {
        quizQuestionRepoSpy.calls.saveGeneratedQuestions.count++;
        quizQuestionRepoSpy.calls.saveGeneratedQuestions.history.push([
            quizQuestions,
            themeId,
        ]);
        return Promise.resolve(returnedValue);
    };
}

class QuizThemeRepositorySpy implements QuizThemeRepository {
    calls = {
        getQuizTheme: {
            count: 0,
            history: [] as string[],
        },
    };

    async getQuizTheme(themeId: string): Promise<QuizTheme | null> {
        this.calls.getQuizTheme.count++;
        this.calls.getQuizTheme.history.push(themeId);
        return null;
    }

    async getQuizThemes(): Promise<QuizTheme[]> {
        return [];
    }

    async saveGeneratedThemes(quizThemes: QuizTheme[]): Promise<QuizTheme[]> {
        return [];
    }
}

function stubGetQuizTheme(
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

function mapToQuizQuestions(
    parsedQuestions: ParsedQuizQuestion[],
): QuizQuestion[] {
    return parsedQuestions.map(
        (question) =>
            new QuizQuestion(
                '',
                question.label,
                question.answers.map(
                    (answer) =>
                        new QuizAnswer('', answer.label, answer.isCorrect),
                ),
            ),
    );
}
