export enum ExceptionCode {
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
