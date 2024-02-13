import { Exception } from '../../../application/exception';

export class QuizGameDoestNotExistException extends Exception {
    readonly message: string;

    constructor(userId: string) {
        super('QuizGameNotFound');
        this.message = this.formatMessage(userId);
    }

    private formatMessage(userId: string): string {
        return `No quiz game was found with given userId "${userId}".`;
    }
}
