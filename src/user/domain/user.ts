export class User {
    get hasBeenWelcomed(): boolean | undefined {
        return this._hasBeenWelcomed;
    }

    constructor(
        readonly id: string,
        readonly email: string,
        private _hasBeenWelcomed?: boolean,
    ) {}

    welcome(): void {
        this._hasBeenWelcomed = true;
    }
}
