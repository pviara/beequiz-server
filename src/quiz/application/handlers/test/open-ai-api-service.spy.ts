import { OpenAIService } from '../../../../open-ai/application/services/open-ai/open-ai-service';
import { ParsedQuizQuestion } from '../../quiz-parser/model/parsed-quiz-question';
import { ParsedQuizTheme } from '../../quiz-parser/model/parsed-quiz-theme';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizTheme } from '../../../domain/quiz-parameters';

export class OpenAIServiceSpy implements OpenAIService {
    calls = {
        generateQuestionsForQuiz: {
            count: 0,
            history: [] as [QuizQuestion[], number, string][],
        },
        generateThemesForQuiz: {
            count: 0,
            history: [] as QuizTheme[][],
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
        this.calls.generateThemesForQuiz.count++;
        this.calls.generateThemesForQuiz.history.push(existingThemes);
        return [];
    }
}

export function makeGenerateQuestionsForQuizThrow(
    openAIServiceSpy: OpenAIServiceSpy,
): void {
    openAIServiceSpy.generateQuestionsForQuiz = (
        existingQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> => {
        registerCallToGenerateQuestionsForQuiz(
            openAIServiceSpy,
            existingQuestions,
            numberOfQuestions,
            themeLabel,
        );
        throw new Error();
    };
}

export function stubGenerateQuestionsForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: ParsedQuizQuestion[],
): void {
    openAIServiceSpy.generateQuestionsForQuiz = (
        existingQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> => {
        registerCallToGenerateQuestionsForQuiz(
            openAIServiceSpy,
            existingQuestions,
            numberOfQuestions,
            themeLabel,
        );
        return Promise.resolve(returnedValue);
    };
}

export function stubGenerateThemesForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    returnedValue: ParsedQuizTheme[],
): void {
    openAIServiceSpy.generateThemesForQuiz = (): Promise<ParsedQuizTheme[]> => {
        openAIServiceSpy.calls.generateThemesForQuiz.count++;
        return Promise.resolve(returnedValue);
    };
}

function registerCallToGenerateQuestionsForQuiz(
    openAIServiceSpy: OpenAIServiceSpy,
    existingQuestions: QuizQuestion[],
    numberOfQuestions: number,
    themeLabel: string,
) {
    openAIServiceSpy.calls.generateQuestionsForQuiz.count++;
    openAIServiceSpy.calls.generateQuestionsForQuiz.history.push([
        existingQuestions,
        numberOfQuestions,
        themeLabel,
    ]);
}
