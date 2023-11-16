import { PasswordHash } from './password-hash';

export class PasswordHasher {
    readonly passwordHash: PasswordHash;

    constructor(passwordToHash: string) {
        this.passwordHash = this.hash(passwordToHash);
    }

    hash(passwordToHash: string): PasswordHash {
        return new PasswordHash('', '');
    }
}
