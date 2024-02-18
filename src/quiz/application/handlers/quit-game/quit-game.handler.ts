import { ActorActionIsNotAllowedException } from '../../errors/actor-action-is-not-allowed.exception';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OnGoingQuizGameNotFoundException } from '../../errors/on-going-quiz-game-not-found.exception';
import { QuizGame } from '../../../domain/quiz-game';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QUIZ_GAME_REPO_TOKEN } from '../../../persistence/quiz-game/repository/quiz-game-repository.provider';

export class QuitGameCommand implements ICommand {
    constructor(
        readonly actorId: string,
        readonly userId: string,
    ) {}
}

@CommandHandler(QuitGameCommand)
export class QuitGameHandler implements ICommandHandler<QuitGameCommand> {
    private game!: QuizGame;

    constructor(
        @Inject(QUIZ_GAME_REPO_TOKEN)
        private repository: QuizGameRepository,
    ) {}

    async execute({ actorId, userId }: QuitGameCommand): Promise<void> {
        const isActorFraud = actorId !== userId;
        if (isActorFraud) {
            throw new ActorActionIsNotAllowedException(actorId);
        }

        await this.getOnGoingGameFor(userId);
        await this.repository.deleteGame(this.game.id);
    }

    private async getOnGoingGameFor(userId: string): Promise<void> {
        const game = await this.repository.getOnGoingGame(userId);
        if (!game) {
            throw new OnGoingQuizGameNotFoundException(userId);
        }
        this.game = game;
    }
}
