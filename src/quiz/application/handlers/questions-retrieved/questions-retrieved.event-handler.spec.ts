import { beforeEach, describe, expect, it } from 'vitest';
import { QuestionsRetrievedEvent } from '../../events/questions-retrieved.event';
import { QuestionsRetrievedHandler } from './questions-retrieved.event-handler';
import { QuizGameRepositorySpy } from '../test/quiz-game-repository.spy';

describe('QuestionsRetrievedHandler', () => {
    let sut: QuestionsRetrievedHandler;
    let gameRepoSpy: QuizGameRepositorySpy;

    beforeEach(() => {
        gameRepoSpy = new QuizGameRepositorySpy();
        sut = new QuestionsRetrievedHandler(gameRepoSpy);
    });

    describe('handle', () => {
        it('should directly create a new on going game', async () => {
            const questionIds = ['questionId1', 'questionId2', 'questionId3'];
            const event = new QuestionsRetrievedEvent('userId', questionIds);

            await sut.handle(event);

            expect(gameRepoSpy.calls.createGame.count).toBe(1);
            expect(gameRepoSpy.calls.createGame.history).toContainEqual([
                event.userId,
                event.questionIds,
            ]);
        });
    });
});
