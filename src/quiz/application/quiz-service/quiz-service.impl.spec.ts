import { DateTimeService } from '../../../shared/data-time-service/datetime-service';
import {
    DEFAULT_NUMBER_OF_QUESTIONS,
    QuizServiceImpl,
} from './quiz-service.impl';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizQuestionRepository } from '../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme/repository/quiz-theme-repository';
import { ParsedQuizTheme } from '../quiz-parser/model/parsed-quiz-theme';
import { ParsedQuizQuestion } from '../quiz-parser/model/parsed-quiz-question';

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
            const parsedQuizThemes: ParsedQuizTheme[] = [
                new ParsedQuizTheme('', ''),
                new ParsedQuizTheme('', ''),
            ];
            const savedQuizThemes = parsedQuizThemes.map(
                (quizTheme) =>
                    new QuizTheme('', quizTheme.code, quizTheme.label),
            );

            stubGenerateThemesForQuiz(openAIServiceSpy, parsedQuizThemes);
            stubSaveGeneratedThemes(quizThemeRepositorySpy, savedQuizThemes);

            const result = await sut.getQuizParameters();

            expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(1);
            expect(result.themes).toEqual(savedQuizThemes);
        });

        it('should not generate new theme parameters when last request was made less than 72 hours ago', async () => {
            const now = new Date('2023-01-01');
            stubGetNow(dateTimeServiceSpy, now);

            const parsedQuizThemes: ParsedQuizTheme[] = [
                new ParsedQuizTheme('codeA', 'labelA'),
                new ParsedQuizTheme('codeB', 'labelB'),
                new ParsedQuizTheme('codeC', 'labelC'),
            ];
            const savedQuizThemes = parsedQuizThemes.map(
                (quizTheme) =>
                    new QuizTheme('', quizTheme.code, quizTheme.label),
            );

            stubGenerateThemesForQuiz(openAIServiceSpy, parsedQuizThemes);
            stubGetQuizThemes(quizThemeRepositorySpy, savedQuizThemes);
            stubSaveGeneratedThemes(quizThemeRepositorySpy, savedQuizThemes);

            const firstResult = await sut.getQuizParameters();
            const secondResult = await sut.getQuizParameters();

            expect(dateTimeServiceSpy.calls.getNow.count).toBe(2);
            expect(openAIServiceSpy.calls.generateThemesForQuiz.count).toBe(1);
            expect(quizThemeRepositorySpy.calls.saveGeneratedThemes.count).toBe(
                1,
            );
            expect(
                quizThemeRepositorySpy.calls.saveGeneratedThemes.history,
            ).toContainEqual(parsedQuizThemes);

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
                new QuizQuestion('', 'label1', []),
            ];
            stubGetQuizQuestions(quizQuestionRepositorySpy, savedQuizQuestions);

            const numberOfQuestions = 5;

            const parsedQuizQuestions = Array.from({
                length: numberOfQuestions,
            }).map((_) => new ParsedQuizQuestion('', []));
            stubGenerateQuestionsForQuiz(openAIServiceSpy, parsedQuizQuestions);

            const questionsSavedAfterGeneration = parsedQuizQuestions.map(
                (quizQuestion) =>
                    new QuizQuestion(
                        '',
                        quizQuestion.label,
                        quizQuestion.answers,
                    ),
            );
            stubSaveGeneratedQuestions(
                quizQuestionRepositorySpy,
                questionsSavedAfterGeneration,
            );

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
            ).toContainEqual(parsedQuizQuestions);

            expect(result).toEqual(questionsSavedAfterGeneration);
            expect(result.length).toBe(numberOfQuestions);
        });

        it('should generate new questions when last request was made more than 72 hours ago', async () => {
            const now = new Date('2023-01-01');
            stubGetNow(dateTimeServiceSpy, now);

            const savedQuestions = [
                new QuizQuestion('', '', []),
                new QuizQuestion('', '', []),
                new QuizQuestion('', '', []),
            ];
            stubGetQuizQuestions(quizQuestionRepositorySpy, savedQuestions);

            const parsedQuestions: ParsedQuizQuestion[] = [
                new ParsedQuizQuestion('label1', []),
                new ParsedQuizQuestion('label2', []),
                new ParsedQuizQuestion('label3', []),
            ];
            const savedQuestionsAfterGeneration = parsedQuestions.map(
                (quizQuestion) =>
                    new QuizQuestion(
                        '',
                        quizQuestion.label,
                        quizQuestion.answers,
                    ),
            );
            stubGenerateQuestionsForQuiz(openAIServiceSpy, parsedQuestions);
            stubSaveGeneratedQuestions(
                quizQuestionRepositorySpy,
                savedQuestionsAfterGeneration,
            );

            const themeId = 'theme_id';
            const numberOfQuestions = 3;

            const firstResult = await sut.getQuizQuestions(
                themeId,
                numberOfQuestions,
            );

            stubGetQuizQuestions(
                quizQuestionRepositorySpy,
                savedQuestionsAfterGeneration,
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
            ).toContainEqual(parsedQuestions);

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
    ): Promise<ParsedQuizQuestion[]> {
        this.calls.generateQuestionsForQuiz.count++;
        this.calls.generateQuestionsForQuiz.history.push([
            savedQuizQuestions,
            numberOfQuestions,
        ]);
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

class QuizQuestionRepositorySpy implements QuizQuestionRepository {
    calls = {
        getQuizQuestions: {
            count: 0,
            history: [] as string[],
        },
        saveGeneratedQuestions: {
            count: 0,
            history: [] as ParsedQuizQuestion[][],
        },
    };

    getQuizQuestions(themeId: string): Promise<QuizQuestion[]> {
        this.calls.getQuizQuestions.count++;
        this.calls.getQuizQuestions.history.push(themeId);
        return Promise.resolve([]);
    }

    saveGeneratedQuestions(
        quizQuestions: QuizQuestion[],
    ): Promise<QuizQuestion[]> {
        this.calls.saveGeneratedQuestions.count++;
        this.calls.saveGeneratedQuestions.history.push(quizQuestions);
        return Promise.resolve([]);
    }
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
    returnedValue: ParsedQuizQuestion[],
): void {
    openAIServiceSpy.generateQuestionsForQuiz = (
        savedQuizQuestions: QuizQuestion[],
        numberOfQuestions: number,
    ): Promise<ParsedQuizQuestion[]> => {
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
    returnedValue: ParsedQuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): Promise<ParsedQuizTheme[]> => {
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
    ): Promise<QuizQuestion[]> => {
        quizQuestionRepositorySpy.calls.getQuizQuestions.count++;
        quizQuestionRepositorySpy.calls.getQuizQuestions.history.push(themeId);
        return Promise.resolve(returnedValue);
    };
}

function stubGetQuizThemes(
    quizThemeRepositorySpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepositorySpy.getQuizThemes = (): Promise<QuizTheme[]> => {
        quizThemeRepositorySpy.calls.getQuizThemes.count++;
        return Promise.resolve(returnedValue);
    };
}

function stubSaveGeneratedQuestions(
    quizQuestionRepositorySpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepositorySpy.saveGeneratedQuestions = (
        quizQuestions: ParsedQuizQuestion[],
    ): Promise<QuizQuestion[]> => {
        quizQuestionRepositorySpy.calls.saveGeneratedQuestions.count++;
        quizQuestionRepositorySpy.calls.saveGeneratedQuestions.history.push(
            quizQuestions,
        );
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
