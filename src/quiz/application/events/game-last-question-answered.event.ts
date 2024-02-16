export class GameLastQuestionAnsweredEvent {
    constructor(
        readonly gameId: string,
        readonly finalScore: number,
    ) {}
}
