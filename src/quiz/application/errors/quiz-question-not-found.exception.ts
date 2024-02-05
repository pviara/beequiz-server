import { Exception } from '../../../application/exception';

export class QuizQuestionNotFoundException extends Exception {
    readonly message: string;

    constructor(questionId: string) {
        super('QuizQuestionNotFound');
        this.message = this.formatMessage(questionId);
    }

    private formatMessage(questionId: string): string {
        return `No quiz question was found with given id "${questionId}".`;
    }
}
