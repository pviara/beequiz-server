export class AddUserDTO {
    constructor(
        private username: string,
        private password: string,
    ) {}

    extractPayload(): { username: string; password: string } {
        const isOneDataFieldNotDefined = !this.username || !this.password;
        const isGlobalDTOInvalid =
            this.isPasswordInvalid() || this.isUsernameInvalid();

        if (isOneDataFieldNotDefined || isGlobalDTOInvalid) {
            throw new Error(
                'DTO cannot be extracted when one of its field is invalid.',
            );
        }

        return {
            username: this.username,
            password: this.password,
        };
    }

    isPasswordInvalid(): boolean {
        return this.isStringEmptyOrWhitespaced(this.password);
    }

    isUsernameInvalid(): boolean {
        return this.isStringEmptyOrWhitespaced(this.username);
    }

    private isStringEmptyOrWhitespaced(str: string): boolean {
        return !str || str.includes(' ');
    }
}
