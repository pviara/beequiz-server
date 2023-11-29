export class QuizAnswer {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly isCorrect: boolean,
    ) {}
}

export class QuizQuestion {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly answers: QuizAnswer[],
    ) {}
}
