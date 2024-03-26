import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameLastQuestionAnsweredEvent } from '../../events/game-last-question-answered.event';
import { Inject } from '@nestjs/common';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { UserStatsRepository } from '../../../../user/persistence/repository/user-stats/user-stats-repository';
import { USER_STATS_REPO_TOKEN } from '../../../../user/persistence/repository/user-stats/user-stats-repository.provider';

@EventsHandler(GameLastQuestionAnsweredEvent)
export class GameLastQuestionAnsweredHandler
    implements IEventHandler<GameLastQuestionAnsweredEvent>
{
    constructor(
        private gameRepo: QuizGameRepository,

        @Inject(USER_STATS_REPO_TOKEN)
        private userStatsRepo: UserStatsRepository,
    ) {}

    async handle({
        game,
        finalScore,
    }: GameLastQuestionAnsweredEvent): Promise<void> {
        await this.userStatsRepo.updateUserStats(game.userId, {
            points: finalScore,
            answers: game.questionIds.length,
        });

        await this.gameRepo.deleteGame(game.id);
    }
}
