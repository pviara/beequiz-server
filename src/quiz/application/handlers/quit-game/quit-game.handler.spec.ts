import { ActorActionIsNotAllowedException } from '../../errors/actor-action-is-not-allowed.exception';
import { beforeEach, describe, expect, it } from 'vitest';
import { OnGoingQuizGameNotFoundException } from '../../errors/on-going-quiz-game-not-found.exception';
import { QuitGameCommand, QuitGameHandler } from './quit-game.handler';
import {
    QuizGameRepositorySpy,
    stubGetOnGoingGame,
} from '../test/quiz-game-repository.spy';
import { QuizGame } from 'src/quiz/domain/quiz-game';

describe('QuitGameHandler', () => {
    let sut: QuitGameHandler;
    let gameRepoSpy: QuizGameRepositorySpy;

    const existingGame = new QuizGame('id', 'userId', [], 0);

    beforeEach(() => {
        gameRepoSpy = new QuizGameRepositorySpy();
        sut = new QuitGameHandler(gameRepoSpy);
    });

    describe('execute', () => {
        it("should throw an error when given userId doesn't point to any game", async () => {
            const actorId = 'actorId';
            const command = new QuitGameCommand(actorId, actorId);

            stubGetOnGoingGame(gameRepoSpy, null);

            await expect(sut.execute(command)).rejects.toThrow(
                OnGoingQuizGameNotFoundException,
            );
        });

        it('should throw an error when actorId is not given userId', async () => {
            const actorId = 'unauthorized_actorId';
            const command = new QuitGameCommand(actorId, 'userId');

            stubGetOnGoingGame(gameRepoSpy, existingGame);

            await expect(sut.execute(command)).rejects.toThrow(
                ActorActionIsNotAllowedException,
            );
        });

        it('should delete the on going game using given userId', async () => {
            const actorId = 'actorId';
            const command = new QuitGameCommand(actorId, actorId);

            stubGetOnGoingGame(gameRepoSpy, existingGame);

            await sut.execute(command);

            expect(gameRepoSpy.calls.deleteGame.count).toBe(1);
            expect(gameRepoSpy.calls.deleteGame.history).toContain(
                existingGame.id,
            );
        });
    });
});
