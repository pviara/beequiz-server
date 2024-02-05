import { Exception } from '../../../application/exception';

export class UserAlreadyExistsException extends Exception {
    readonly message: string;

    constructor(username: string) {
        super('UserAlreadyExists');
        this.message = this.formatMessage(username);
    }

    private formatMessage(username: string): string {
        return `User already exists with username "${username}".`;
    }
}
