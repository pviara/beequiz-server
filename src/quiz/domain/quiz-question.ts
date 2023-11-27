export class QuizAnswer {
    constructor(
        readonly label: string,
        readonly isCorrect: boolean,
    ) {}
}

export class QuizQuestion {
    constructor(
        readonly label: string,
        readonly answers: QuizAnswer[],
    ) {}
}
