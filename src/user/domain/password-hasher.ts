import { genSalt, hash } from 'bcrypt';
import { PasswordHash } from './password-hash';

export class PasswordHasher {
    constructor(private passwordToHash: string) {}

    async hash(): Promise<PasswordHash> {
        const salt = await genSalt(10);
        const hashedPassword = await hash(this.passwordToHash, salt);

        return new PasswordHash(hashedPassword, salt);
    }
}
