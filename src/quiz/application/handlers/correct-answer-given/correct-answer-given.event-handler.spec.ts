import { beforeEach, describe, expect, it } from 'vitest';
import { CorrectAnswerGivenHandler } from './correct-answer-given.event-handler';
import { QuizGameRepositorySpy } from '../test/quiz-game-repository.spy';
import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';

describe('CorrectAnswerGivenHandler', () => {
    let sut: CorrectAnswerGivenHandler;
    let gameRepoSpy: QuizGameRepositorySpy;

    beforeEach(() => {
        gameRepoSpy = new QuizGameRepositorySpy();
        sut = new CorrectAnswerGivenHandler(gameRepoSpy);
    });

    describe('handle', () => {
        it('should directly update matching game', async () => {
            const gameId = 'gameId';
            const event = new CorrectAnswerGivenEvent(gameId);

            await sut.handle(event);

            expect(gameRepoSpy.calls.increaseGameScore.count).toBe(1);
            expect(gameRepoSpy.calls.increaseGameScore.history).toContain(
                gameId,
            );
        });
    });
});
