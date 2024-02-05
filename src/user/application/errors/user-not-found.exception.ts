import { Exception } from '../../../application/exception';

export class UserNotFoundException extends Exception {
    readonly message: string;

    constructor(username: string, key: 'id' | 'username') {
        super('UserNotFound');
        this.message = this.formatMessage(username, key);
    }

    private formatMessage(username: string, key: string): string {
        return `No user was found with given ${key} "${username}".`;
    }
}
