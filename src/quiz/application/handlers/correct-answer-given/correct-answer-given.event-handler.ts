import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QUIZ_GAME_REPO_TOKEN } from '../../../persistence/quiz-game/repository/quiz-game-repository.provider';

@EventsHandler(CorrectAnswerGivenEvent)
export class CorrectAnswerGivenHandler
    implements IEventHandler<CorrectAnswerGivenEvent>
{
    constructor(
        @Inject(QUIZ_GAME_REPO_TOKEN)
        readonly repository: QuizGameRepository,
    ) {}

    async handle({ gameId }: CorrectAnswerGivenEvent): Promise<void> {
        return this.repository.increaseGameScore(gameId);
    }
}
