import { OpenAIService } from './open-ai-service';
import {
    ParsedQuizAnswer,
    ParsedQuizQuestion,
} from '../../../../quiz/application/quiz-parser/model/parsed-quiz-question';
import { ParsedQuizTheme } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-theme';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export class FakeOpenAIServiceImpl implements OpenAIService {
    async generateQuestionsForQuiz(
        existingQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> {
        return [
            new ParsedQuizQuestion('questionA', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionB', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionC', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionD', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionE', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionA', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionB', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionC', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionD', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionE', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionA', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionB', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionC', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionD', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
            new ParsedQuizQuestion('questionE', [
                new ParsedQuizAnswer('reponse A', false),
                new ParsedQuizAnswer('reponse B', false),
                new ParsedQuizAnswer('reponse C', true),
                new ParsedQuizAnswer('reponse D', false),
            ]),
        ].slice(0, numberOfQuestions);
    }
    generateThemesForQuiz(
        existingThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]> {
        throw new Error('Method not implemented.');
    }
}
