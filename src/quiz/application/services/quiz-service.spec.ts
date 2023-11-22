import { DateTimeService } from 'src/application/datetime-service';
import {
    DEFAULT_NUMBER_OF_QUESTIONS,
    QuizServiceImplement,
} from './quiz-service';
import { OpenAIService } from './open-ai-service';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from 'src/quiz/persistence/quiz-theme-repository';

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
        it('should return default number of questions parameter choices', () => {
            expect(sut.getQuizParameters().numberOfQuestions).toEqual(
                DEFAULT_NUMBER_OF_QUESTIONS,
            );
        });

        it('should generate new theme parameters using OpenAI', () => {
            const quizThemes: QuizTheme[] = [
                new QuizTheme('', ''),
                new QuizTheme('', ''),
            ];
            stubGenerateThemesForQuiz(openAIServiceSpy, quizThemes);

            const result = sut.getQuizParameters();

            expect(openAIServiceSpy.callsToGenerateThemesForQuiz).toBe(1);
            expect(result.themes).toEqual(quizThemes);
        });

        it('should not generate new theme parameters when last request was made less than 72 hours ago', () => {
            const now = new Date('2023-01-01');
            stubGetNow(dateTimeServiceSpy, now);

            const quizThemesA: QuizTheme[] = [
                new QuizTheme('codeA', 'labelA'),
                new QuizTheme('codeB', 'labelB'),
                new QuizTheme('codeC', 'labelC'),
            ];

            stubGenerateThemesForQuiz(openAIServiceSpy, quizThemesA);
            stubGetQuizThemes(quizThemeRepositorySpy, quizThemesA);

            const firstResult = sut.getQuizParameters();
            const secondResult = sut.getQuizParameters();

            expect(dateTimeServiceSpy.callsToGetNow).toBe(2);
            expect(openAIServiceSpy.callsToGenerateThemesForQuiz).toBe(1);
            expect(quizThemeRepositorySpy.callsToSaveGeneratedThemes).toBe(1);
            expect(quizThemeRepositorySpy.callsToGetQuizThemes).toBe(1);

            expect(firstResult.themes).toEqual(secondResult.themes);
        });
    });
});

class DateTimeServiceSpy implements DateTimeService {
    callsToGetNow = 0;

    getNow(): Date {
        this.callsToGetNow++;
        return new Date('1900-01-01');
    }
}

class OpenAIServiceSpy implements OpenAIService {
    callsToGenerateThemesForQuiz = 0;

    generateThemesForQuiz(length = 5): QuizTheme[] {
        this.callsToGenerateThemesForQuiz++;
        return Array.from({ length }).map((_) => new QuizTheme('', ''));
    }
}

class QuizThemeRepositorySpy implements QuizThemeRepository {
    callsToGetQuizThemes = 0;
    callsToSaveGeneratedThemes = 0;

    getQuizThemes(): QuizTheme[] {
        this.callsToGetQuizThemes++;
        return [];
    }

    saveGeneratedThemes(quizThemes: QuizTheme[]): void {
        this.callsToSaveGeneratedThemes++;
    }
}

function stubGetNow(
    dateTimeServiceSpy: DateTimeServiceSpy,
    returnedValue: Date,
): void {
    dateTimeServiceSpy.getNow = (): Date => {
        dateTimeServiceSpy.callsToGetNow++;
        return returnedValue;
    };
}

function stubGenerateThemesForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: QuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): QuizTheme[] => {
        openAIServiceSpy.callsToGenerateThemesForQuiz++;
        return returnedValue;
    };
}

function stubGetQuizThemes(
    quizThemeRepositorySpy: QuizThemeRepositorySpy,
    returnedValue: QuizTheme[],
): void {
    quizThemeRepositorySpy.getQuizThemes = (): QuizTheme[] => {
        quizThemeRepositorySpy.callsToGetQuizThemes++;
        return returnedValue;
    };
}
