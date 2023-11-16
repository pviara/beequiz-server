export class PasswordHash {
    constructor(
        readonly hash: string,
        readonly salt: string,
    ) {}
}
