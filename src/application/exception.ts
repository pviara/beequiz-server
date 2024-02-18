export type ExceptionCode =
    | 'ActorActionIsNotAllowed'
    | 'OnGoingQuizGameNotFound'
    | 'ProblemOccurredWithOpenAI'
    | 'QuizAnswerDoesNotExist'
    | 'QuizGameNotFound'
    | 'QuizQuestionNotFound'
    | 'QuizThemeNotFound'
    | 'StillOnGoingQuizGame'
    | 'UserAlreadyExists'
    | 'UserNotFound';

export class Exception extends Error {
    constructor(readonly code: ExceptionCode) {
        super();
    }
}
