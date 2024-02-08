import { Exception } from '../../../application/exception';

export class UserNotFoundException extends Exception {
    readonly message: string;

    constructor(value: string, key: 'id' | 'email') {
        super('UserNotFound');
        this.message = this.formatMessage(value, key);
    }

    private formatMessage(value: string, key: string): string {
        return `No user was found with given ${key} "${value}".`;
    }
}
