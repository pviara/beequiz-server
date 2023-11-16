import { PasswordHasher } from './password-hasher';
import { User } from './user';

export class UserPassword {
    constructor(
        readonly user: User,
        readonly password: PasswordHasher,
    ) {}
}
