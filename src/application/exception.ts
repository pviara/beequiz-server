export enum ExceptionCode {
    QuizThemeNotFound,
    UserAlreadyExists,
    UserNotFound,
}

export class Exception extends Error {
    constructor(readonly code: ExceptionCode) {
        super();
    }
}
