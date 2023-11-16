import { User } from './user';

export class UserPassword {
    constructor(
        readonly user: User,
        readonly hash: string,
        readonly salt: string,
    ) {}
}
