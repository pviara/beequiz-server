export class QuizAnswerDTO {
    constructor(
        readonly id: string,
        readonly label: string,
    ) {}
}

export class QuizQuestionDTO {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly answers: QuizAnswerDTO[],
    ) {}
}
