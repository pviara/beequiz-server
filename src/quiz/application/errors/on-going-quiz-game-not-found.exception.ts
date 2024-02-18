import { Exception } from '../../../application/exception';

export class OnGoingQuizGameNotFoundException extends Exception {
    readonly message: string;

    constructor(userId: string) {
        super('OnGoingQuizGameNotFound');
        this.message = this.formatMessage(userId);
    }

    private formatMessage(userId: string): string {
        return `No on going game could be found with user id "${userId}".`;
    }
}
