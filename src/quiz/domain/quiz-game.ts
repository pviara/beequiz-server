export class QuizGame {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly questions: string[],
        readonly score: number,
    ) {}
}
