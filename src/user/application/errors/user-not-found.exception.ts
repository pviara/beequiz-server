import { Exception, ExceptionCode } from '../../../application/exception';

export class UserNotFoundException extends Exception {
    readonly message: string;

    constructor(username: string) {
        super(ExceptionCode.UserNotFound);
        this.message = this.formatMessage(username);
    }

    private formatMessage(username: string): string {
        return `No user was found with given username "${username}".`;
    }
}
