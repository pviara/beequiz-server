export class User {
    constructor(
        readonly id: string,
        readonly username: string,
        readonly hasBeenWelcomed?: boolean,
    ) {}
}
