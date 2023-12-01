import { ParsedQuizQuestion } from '../../quiz-parser/model/parsed-quiz-question';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';

export class QuizQuestionRepositorySpy implements QuizQuestionRepository {
    calls = {
        getQuizQuestion: {
            count: 0,
            history: [] as string[],
        },
        getQuizQuestions: {
            count: 0,
            history: [] as [number, string][],
        },
        saveGeneratedQuestions: {
            count: 0,
            history: [] as [ParsedQuizQuestion[], string][],
        },
    };

    async getQuizQuestion(questionId: string): Promise<QuizQuestion | null> {
        this.calls.getQuizQuestion.count++;
        this.calls.getQuizQuestion.history.push(questionId);
        return null;
    }

    async getQuizQuestions(
        length: number,
        themeId: string,
    ): Promise<QuizQuestion[]> {
        this.calls.getQuizQuestions.count++;
        this.calls.getQuizQuestions.history.push([length, themeId]);
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

export function stubGetQuizQuestion(
    quizQuestionRepoSpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion | null,
): void {
    quizQuestionRepoSpy.getQuizQuestion = (
        questionId: string,
    ): Promise<QuizQuestion | null> => {
        quizQuestionRepoSpy.calls.getQuizQuestion.count++;
        quizQuestionRepoSpy.calls.getQuizQuestion.history.push(questionId);
        return Promise.resolve(returnedValue);
    };
}

export function stubGetQuizQuestions(
    quizQuestionRepoSpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepoSpy.getQuizQuestions = (
        length: number,
        themeId: string,
    ): Promise<QuizQuestion[]> => {
        quizQuestionRepoSpy.calls.getQuizQuestions.count++;
        quizQuestionRepoSpy.calls.getQuizQuestions.history.push([
            length,
            themeId,
        ]);
        return Promise.resolve(returnedValue);
    };
}

export function stubSaveGeneratedQuestions(
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

export function mapToQuizQuestions(
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
