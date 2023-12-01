export enum ExceptionCode {
    QuizAnswerDoesNotExist,
    QuizQuestionNotFound,
    QuizThemeNotFound,
    UserAlreadyExists,
    UserNotFound,
}

export class Exception extends Error {
    constructor(readonly code: ExceptionCode) {
        super();
    }
}
