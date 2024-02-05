import { Exception } from '../../../application/exception';

export class QuizAnswerDoesNotExistException extends Exception {
    readonly message: string;

    constructor(answerId: string, questionId: string) {
        super('QuizAnswerDoesNotExist');
        this.message = this.formatMessage(answerId, questionId);
    }

    private formatMessage(answerId: string, questionId: string): string {
        return `No quiz answer was found with given id "${answerId}" for question with id "${questionId}".`;
    }
}
