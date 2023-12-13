export enum ExceptionCode {
    InvalidStringifiedObject,
    QuizAnswerDoesNotExist,
    QuizQuestionNotFound,
    QuizThemeNotFound,
    StillOnGoingQuizGame,
    UserAlreadyExists,
    UserNotFound,
}

export class Exception extends Error {
    constructor(readonly code: ExceptionCode) {
        super();
    }
}
