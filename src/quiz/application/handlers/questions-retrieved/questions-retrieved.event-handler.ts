import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuestionsRetrievedEvent } from '../../events/questions-retrieved.event';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QUIZ_GAME_REPO_TOKEN } from '../../../persistence/quiz-game/repository/quiz-game-repository.provider';

@EventsHandler(QuestionsRetrievedEvent)
export class QuestionsRetrievedHandler
    implements IEventHandler<QuestionsRetrievedEvent>
{
    constructor(
        @Inject(QUIZ_GAME_REPO_TOKEN)
        private repository: QuizGameRepository,
    ) {}

    async handle({
        userId,
        questionIds,
    }: QuestionsRetrievedEvent): Promise<void> {
        await this.repository.createGame(userId, questionIds);
    }
}
