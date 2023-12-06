import { PasswordHash } from '../../domain/password-hash';

export class AddUserRepoDTO {
    constructor(
        readonly username: string,
        readonly hashedPassword: PasswordHash,
    ) {}
}
