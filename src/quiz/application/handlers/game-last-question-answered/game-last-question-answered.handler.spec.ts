import { beforeEach, describe, expect, it } from 'vitest';
import { GameLastQuestionAnsweredHandler } from './game-last-question-answered.handler';
import { GameLastQuestionAnsweredEvent } from '../../events/game-last-question-answered.event';
import { QuizGame } from '../../../domain/quiz-game';
import { QuizGameRepositorySpy } from '../test/quiz-game-repository.spy';
import { UserStatsRepositorySpy } from '../../../../user/application/test/user-stats-repository.spy';

describe('GameLastQuestionAnsweredHandler', () => {
    let sut: GameLastQuestionAnsweredHandler;

    let gameRepoSpy: QuizGameRepositorySpy;
    let userStatsRepoSpy: UserStatsRepositorySpy;

    beforeEach(() => {
        gameRepoSpy = new QuizGameRepositorySpy();
        userStatsRepoSpy = new UserStatsRepositorySpy();

        sut = new GameLastQuestionAnsweredHandler(
            gameRepoSpy,
            userStatsRepoSpy,
        );
    });

    describe('handle', () => {
        it('should save user stats', async () => {
            const event = new GameLastQuestionAnsweredEvent(
                new QuizGame(
                    'id',
                    'userId',
                    ['questionId1', 'questionId2', 'questionId3'],
                    3,
                ),
                4,
            );

            await sut.handle(event);

            expect(userStatsRepoSpy.calls.updateUserStats.count).toBe(1);
            expect(
                userStatsRepoSpy.calls.updateUserStats.history,
            ).toContainEqual([
                event.game.userId,
                {
                    points: event.finalScore,
                    answers: event.game.questionIds.length,
                },
            ]);
        });

        it('should delete on going game', async () => {
            const event = new GameLastQuestionAnsweredEvent(
                new QuizGame(
                    'id',
                    'userId',
                    ['questionId1', 'questionId2', 'questionId3'],
                    3,
                ),
                4,
            );

            await sut.handle(event);

            expect(gameRepoSpy.calls.deleteGame.count).toBe(1);
            expect(gameRepoSpy.calls.deleteGame.history).toContain(
                event.game.id,
            );
        });
    });
});
