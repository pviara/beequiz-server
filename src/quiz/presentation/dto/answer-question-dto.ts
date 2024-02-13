export class AnswerQuestionDTO {
    constructor(
        readonly userId: string,
        readonly answerId: string,
        readonly questionId: string,
    ) {}
}
