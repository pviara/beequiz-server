import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';

@EventsHandler(CorrectAnswerGivenEvent)
export class CorrectAnswerGivenHandler
    implements IEventHandler<CorrectAnswerGivenEvent>
{
    constructor(private repository: QuizGameRepository) {}

    async handle({ gameId }: CorrectAnswerGivenEvent): Promise<void> {
        return this.repository.increaseGameScore(gameId);
    }
}
