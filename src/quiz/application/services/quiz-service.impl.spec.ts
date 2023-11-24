import {
    DEFAULT_NUMBER_OF_QUESTIONS,
    QuizServiceImplement,
} from './quiz-service.impl';
import { DateTimeService } from '../../../application/datetime-service';
import { OpenAIService } from './open-ai-service';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from '../../persistence/quiz-theme-repository';

describe('QuizService', () => {
    let sut: QuizServiceImplement;

    let dateTimeServiceSpy: DateTimeServiceSpy;
    let openAIServiceSpy: OpenAIServiceSpy;
    let quizThemeRepositorySpy: QuizThemeRepositorySpy;

    beforeEach(() => {
        dateTimeServiceSpy = new DateTimeServiceSpy();
        openAIServiceSpy = new OpenAIServiceSpy();
        quizThemeRepositorySpy = new QuizThemeRepositorySpy();

        sut = new QuizServiceImplement(
            dateTimeServiceSpy,
            openAIServiceSpy,
            quizThemeRepositorySpy,
        );
    });

    describe('getParameters', () => {
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
        generateThemesForQuiz: {
            count: 0,
            history: [] as QuizTheme[][],
        },
    };

    generateThemesForQuiz(savedQuizThemes: QuizTheme[]): Promise<QuizTheme[]> {
        this.calls.generateThemesForQuiz.count++;
        this.calls.generateThemesForQuiz.history.push(savedQuizThemes);
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

function stubGenerateThemesForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: QuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): Promise<QuizTheme[]> => {
        openAIServiceSpy.calls.generateThemesForQuiz.count++;
        return Promise.resolve(returnedValue);
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
