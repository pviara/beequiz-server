export class QuizGame {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly questionIds: string[],
        readonly score: number,
    ) {}
}
