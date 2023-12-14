export class ParsingQuizHasFailedException extends Error {
    constructor(readonly message: string) {
        super();
    }
}
