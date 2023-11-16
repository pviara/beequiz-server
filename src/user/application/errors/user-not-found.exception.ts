import { UserErrorCode } from './user-error-code';

export class UserNotFoundException extends Error {
    readonly code = UserErrorCode.NotFound;
    readonly message: string;

    constructor(username: string) {
        super();
        this.message = this.formatMessage(username);
    }

    private formatMessage(username: string): string {
        return `No user was found with given username "${username}".`;
    }
}
