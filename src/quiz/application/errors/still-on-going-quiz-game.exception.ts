import { Exception, ExceptionCode } from '../../../application/exception';

export class StillOnGoingQuizGameException extends Exception {
    readonly message: string;

    constructor(userId: string) {
        super(ExceptionCode.StillOnGoingQuizGame);
        this.message = this.formatMessage(userId);
    }

    private formatMessage(userId: string): string {
        return `There's still an on going quiz game for user with id "${userId}".`;
    }
}
