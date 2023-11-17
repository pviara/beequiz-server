class QuizTheme {
    constructor(
        readonly code: string,
        readonly label: string,
    ) {}
}

export class QuizParameters {
    constructor(
        readonly themes: QuizTheme[],
        readonly numberOfQuestions: number[],
    ) {}
}
