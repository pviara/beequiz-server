export class ParsedQuizAnswer {
    constructor(
        readonly label: string,
        readonly isCorrect: boolean,
    ) {}
}

export class ParsedQuizQuestion {
    constructor(
        readonly label: string,
        readonly answers: ParsedQuizAnswer[],
    ) {}
}
