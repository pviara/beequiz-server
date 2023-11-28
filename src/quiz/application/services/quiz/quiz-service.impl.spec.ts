import { DateTimeService } from '../../../../shared/datetime-service';
import {
    DEFAULT_NUMBER_OF_QUESTIONS,
    QuizServiceImpl,
} from './quiz-service.impl';
import { OpenAIService } from '../../../../open-ai/application/services/open-ai/open-ai-service';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../../persistence/quiz-theme/repository/quiz-theme-repository';

describe('QuizServiceImpl', () => {
    let sut: QuizServiceImpl;

    let dateTimeServiceSpy: DateTimeServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizQuestionRepositorySpy: QuizQuestionRepositorySpy;
    let quizThemeRepositorySpy: QuizThemeRepositorySpy;

    beforeEach(() => {
        dateTimeServiceSpy = new DateTimeServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizQuestionRepositorySpy = new QuizQuestionRepositorySpy();
        quizThemeRepositorySpy = new QuizThemeRepositorySpy();

        sut = new QuizServiceImpl(
            dateTimeServiceSpy,
            openAIServiceSpy,
            quizQuestionRepositorySpy,
            quizThemeRepositorySpy,
        );
    });

    describe('getQuizParameters', () => {
        it('should return default number of questions parameter choices', async () => {
            const result = await sut.getQuizParameters();

            expect(result.numberOfQuestions).toEqual(
                DEFAULT_NUMBER_OF_QUESTIONS,
            );
        });

        it('should generate new theme parameters using OpenAI', async () => {
            const quizThemes: QuizTheme[] = [
                new QuizTheme('', ''),
                new QuizTheme('', ''),
            ];
            stubGenerateThemesForQuiz(openAIServiceSpy, quizThemes);

            const result = await sut.getQuizParameters();

            expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(1);
            expect(result.themes).toEqual(quizThemes);
        });

        it('should not generate new theme parameters when last request was made less than 72 hours ago', async () => {
            const now = new Date('2023-01-01');
            stubGetNow(dateTimeServiceSpy, now);

            const quizThemesA: QuizTheme[] = [
                new QuizTheme('codeA', 'labelA'),
                new QuizTheme('codeB', 'labelB'),
                new QuizTheme('codeC', 'labelC'),
            ];

            stubGenerateThemesForQuiz(openAIServiceSpy, quizThemesA);
            stubGetQuizThemes(quizThemeRepositorySpy, quizThemesA);

            const firstResult = await sut.getQuizParameters();
            const secondResult = await sut.getQuizParameters();

            expect(dateTimeServiceSpy.calls.getNow.count).toBe(2);
            expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(1);
            expect(quizThemeRepositorySpy.calls.saveGeneratedThemes.count).toBe(
                1,
            );
            expect(
                quizThemeRepositorySpy.calls.saveGeneratedThemes.history,
            ).toContainEqual(quizThemesA);

            expect(firstResult.themes).toEqual(secondResult.themes);
        });
    });

    describe('getQuizQuestions', () => {
        it('should retrieve all theme-related questions from repository', async () => {
            const themeId = 'theme_id';
            await sut.getQuizQuestions(themeId, 5);

            expect(quizQuestionRepositorySpy.calls.getQuizQuestions.count).toBe(
                1,
            );
            expect(
                quizQuestionRepositorySpy.calls.getQuizQuestions.history,
            ).toContain(themeId);
        });

        it('should generate new questions using OpenAI when there is not enough theme-related questions', async () => {
            const savedQuizQuestions: QuizQuestion[] = [
                new QuizQuestion('label1', []),
            ];
            stubGetQuizQuestions(quizQuestionRepositorySpy, savedQuizQuestions);

            const numberOfQuestions = 5;

            const quizQuestions = Array.from({ length: numberOfQuestions }).map(
                (_) => new QuizQuestion('', []),
            );
            stubGenerateQuestionsForQuiz(openAIServiceSpy, quizQuestions);

            const themeId = 'theme_id';
            const result = await sut.getQuizQuestions(
                themeId,
                numberOfQuestions,
            );

            expect(openAIServiceSpy.calls.generateQuestionsForQuiz.count).toBe(
                1,
            );
            expect(
                openAIServiceSpy.calls.generateQuestionsForQuiz.history,
            ).toContainEqual([savedQuizQuestions, numberOfQuestions]);

            expect(
                quizQuestionRepositorySpy.calls.saveGeneratedQuestions.count,
            ).toBe(1);
            expect(
                quizQuestionRepositorySpy.calls.saveGeneratedQuestions.history,
            ).toContainEqual(quizQuestions);

            expect(result).toEqual(quizQuestions);
            expect(result.length).toBe(numberOfQuestions);
        });

        it('should generate new questions when last request was made more than 72 hours ago', async () => {
            const now = new Date('2023-01-01');
            stubGetNow(dateTimeServiceSpy, now);

            const quizQuestionsA: QuizQuestion[] = [
                new QuizQuestion('label1', []),
                new QuizQuestion('label2', []),
                new QuizQuestion('label3', []),
            ];

            stubGenerateQuestionsForQuiz(openAIServiceSpy, quizQuestionsA);
            stubGetQuizQuestions(quizQuestionRepositorySpy, quizQuestionsA);

            const themeId = 'theme_id';
            const numberOfQuestions = 3;

            const firstResult = await sut.getQuizQuestions(
                themeId,
                numberOfQuestions,
            );
            const secondResult = await sut.getQuizQuestions(
                themeId,
                numberOfQuestions,
            );

            expect(dateTimeServiceSpy.calls.getNow.count).toBe(2);
            expect(openAIServiceSpy.calls.generateQuestionsForQuiz.count).toBe(
                1,
            );
            expect(
                quizQuestionRepositorySpy.calls.saveGeneratedQuestions.count,
            ).toBe(1);
            expect(
                quizQuestionRepositorySpy.calls.saveGeneratedQuestions.history,
            ).toContainEqual(quizQuestionsA);

            expect(firstResult).toEqual(secondResult);
        });
    });
});

class DateTimeServiceSpy implements DateTimeService {
    calls = {
        getNow: {
            count: 0,
        },
    };

    getNow(): Date {
        this.calls.getNow.count++;
        return new Date('1900-01-01');
    }
}

class OpenAIServiceSpy implements OpenAIService {
    calls = {
        generateQuestionsForQuiz: {
            count: 0,
            history: [] as [QuizQuestion[], number][],
        },
        generateThemesForQuiz: {
            count: 0,
            history: [] as QuizTheme[][],
        },
    };

    generateQuestionsForQuiz(
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]> {
        this.calls.generateQuestionsForQuiz.count++;
        this.calls.generateQuestionsForQuiz.history.push([
            savedQuizQuestions,
            numberOfQuestions,
        ]);
        return Promise.resolve([]);
    }

    generateThemesForQuiz(savedQuizThemes: QuizTheme[]): Promise<QuizTheme[]> {
        this.calls.generateThemesForQuiz.count++;
        this.calls.generateThemesForQuiz.history.push(savedQuizThemes);
        return Promise.resolve([]);
    }
}

class QuizQuestionRepositorySpy implements QuizQuestionRepository {
    calls = {
        getQuizQuestions: {
            count: 0,
            history: [] as string[],
        },
        saveGeneratedQuestions: {
            count: 0,
            history: [] as QuizQuestion[][],
        },
    };

    getQuizQuestions(themeId: string): QuizQuestion[] {
        this.calls.getQuizQuestions.count++;
        this.calls.getQuizQuestions.history.push(themeId);
        return [];
    }

    saveGeneratedQuestions(quizQuestions: QuizQuestion[]): void {
        this.calls.saveGeneratedQuestions.count++;
        this.calls.saveGeneratedQuestions.history.push(quizQuestions);
    }
}

class QuizThemeRepositorySpy implements QuizThemeRepository {
    calls = {
        getQuizThemes: {
            count: 0,
        },
        saveGeneratedThemes: {
            count: 0,
            history: [] as QuizTheme[][],
        },
    };

    getQuizThemes(): QuizTheme[] {
        this.calls.getQuizThemes.count++;
        return [];
    }

    saveGeneratedThemes(quizThemes: QuizTheme[]): void {
        this.calls.saveGeneratedThemes.count++;
        this.calls.saveGeneratedThemes.history.push(quizThemes);
    }
}

function stubGetNow(
    dateTimeServiceSpy: DateTimeServiceSpy,
    returnedValue: Date,
): void {
    dateTimeServiceSpy.getNow = (): Date => {
        dateTimeServiceSpy.calls.getNow.count++;
        return returnedValue;
    };
}

function stubGenerateQuestionsForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: QuizQuestion[],
): void {
    openAIServiceSpy.generateQuestionsForQuiz = (
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<QuizQuestion[]> => {
        openAIServiceSpy.calls.generateQuestionsForQuiz.count++;
        openAIServiceSpy.calls.generateQuestionsForQuiz.history.push([
            savedQuizQuestions,
            numberOfQuestions,
        ]);
        return Promise.resolve(returnedValue);
    };
}

function stubGenerateThemesForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: QuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): Promise<QuizTheme[]> => {
        openAIServiceSpy.calls.generateThemesForQuiz.count++;
        return Promise.resolve(returnedValue);
    };
}

function stubGetQuizQuestions(
    quizQuestionRepositorySpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepositorySpy.getQuizQuestions = (
        themeId: string,
    ): QuizQuestion[] => {
        quizQuestionRepositorySpy.calls.getQuizQuestions.count++;
        quizQuestionRepositorySpy.calls.getQuizQuestions.history.push(themeId);
        return returnedValue;
    };
}

function stubGetQuizThemes(
    quizThemeRepositorySpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepositorySpy.getQuizThemes = (): QuizTheme[] => {
        quizThemeRepositorySpy.calls.getQuizThemes.count++;
        return returnedValue;
    };
}
