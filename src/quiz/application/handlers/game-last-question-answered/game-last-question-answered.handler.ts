import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GameLastQuestionAnsweredEvent } from '../../events/game-last-question-answered.event';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { UserStatsRepository } from '../../../../user/persistence/repository/user-stats/user-stats-repository';

@EventsHandler(GameLastQuestionAnsweredEvent)
export class GameLastQuestionAnsweredHandler
    implements IEventHandler<GameLastQuestionAnsweredEvent>
{
    constructor(
        private gameRepo: QuizGameRepository,
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
