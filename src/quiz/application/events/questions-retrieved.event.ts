export class QuestionsRetrievedEvent {
    constructor(
        readonly userId: string,
        readonly questionIds: string[],
    ) {}
}
