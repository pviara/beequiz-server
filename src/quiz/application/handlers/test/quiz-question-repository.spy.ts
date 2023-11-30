import { ParsedQuizQuestion } from '../../quiz-parser/model/parsed-quiz-question';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';

export class QuizQuestionRepositorySpy implements QuizQuestionRepository {
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

export function stubGetQuizQuestions(
    quizQuestionRepoSpy: QuizQuestionRepositorySpy,
    returnedValue: QuizQuestion[],
): void {
    quizQuestionRepoSpy.getQuizQuestions = (): Promise<QuizQuestion[]> => {
        quizQuestionRepoSpy.calls.getQuizQuestions.count++;
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
