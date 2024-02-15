import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QuestionsRetrievedEvent } from '../../events/questions-retrieved.event';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';

@EventsHandler(QuestionsRetrievedEvent)
export class QuestionsRetrievedHandler
    implements IEventHandler<QuestionsRetrievedEvent>
{
    constructor(private repository: QuizGameRepository) {}

    async handle({
        userId,
        questionIds,
    }: QuestionsRetrievedEvent): Promise<void> {
        await this.repository.createGame(userId, questionIds);
    }
}
