import { UserErrorCode } from './user-error-code';

export class UserAlreadyExistsException extends Error {
    readonly code = UserErrorCode.AlreadyExists;
    readonly message: string;

    constructor(username: string) {
        super();
        this.message = this.formatMessage(username);
    }

    private formatMessage(username: string): string {
        return `User already exists with username "${username}".`;
    }
}
