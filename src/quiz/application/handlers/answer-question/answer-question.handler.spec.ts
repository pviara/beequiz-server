import {
    AnswerQuestionCommand,
    AnswerQuestionHandler,
} from './answer-question.handler';
import { beforeEach, describe, expect, it } from 'vitest';
import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';
import { EventBusSpy } from '../test/event-bus.spy';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizAnswerDoesNotExistException } from '../../errors/quiz-answer-does-not-exist-in-question.exception';
import { QuizGame } from '../../../domain/quiz-game';
import {
    QuizGameRepositorySpy,
    stubGetOnGoingGame,
} from '../test/quiz-game-repository.spy';
import { QuizQuestionNotFoundException } from '../../errors/quiz-question-not-found.exception';
import {
    QuizQuestionRepositorySpy,
    stubGetQuizQuestion,
} from '../test/quiz-question-repository.spy';
import { QuizGameDoestNotExistException } from '../../errors/quiz-game-does-not-exist.exception';
import { GameLastQuestionAnsweredEvent } from '../../events/game-last-question-answered.event';

describe('AnswerQuestionHandler', () => {
    let sut: AnswerQuestionHandler;

    let eventBusSpy: EventBusSpy;
    let quizGameRepoSpy: QuizGameRepositorySpy;
    let quizQuestionRepoSpy: QuizQuestionRepositorySpy;

    const existingAnswers: QuizAnswer[] = [
        new QuizAnswer('id1', 'label1', false),
        new QuizAnswer('id2', 'label2', false),
        new QuizAnswer('id3', 'label3', true),
        new QuizAnswer('id4', 'label4', false),
    ];
    const existingQuestion = new QuizQuestion('id1', 'label1', existingAnswers);
    const existingGame = new QuizGame(
        'id',
        'userId',
        [
            'questionId1',
            'questionId2',
            'questionId3',
            'questionId4',
            'questionId5',
        ],
        0,
    );

    beforeEach(() => {
        eventBusSpy = new EventBusSpy();
        quizGameRepoSpy = new QuizGameRepositorySpy();
        quizQuestionRepoSpy = new QuizQuestionRepositorySpy();

        sut = new AnswerQuestionHandler(
            eventBusSpy,
            quizGameRepoSpy,
            quizQuestionRepoSpy,
        );
    });

    describe('execute', () => {
        describe('no ongoing game could be found', () => {
            it('should throw an error when no on going game exists for given params', async () => {
                const command = new AnswerQuestionCommand(
                    'not_existing_userId',
                    'answerId',
                    'questionId',
                );

                stubGetOnGoingGame(quizGameRepoSpy, null);

                await expect(sut.execute(command)).rejects.toThrow(
                    QuizGameDoestNotExistException,
                );
            });
        });

        describe('an ongoing game exists', () => {
            beforeEach(() => {
                stubGetOnGoingGame(quizGameRepoSpy, existingGame);
            });

            const existingAnswer = existingAnswers[0];
            const [, , correctAnswer] = existingAnswers;

            it('should retrieve quiz related question using given question', async () => {
                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    existingAnswer.id,
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, existingQuestion);

                await sut.execute(command);

                expect(quizQuestionRepoSpy.calls.getQuizQuestion.count).toBe(1);
                expect(
                    quizQuestionRepoSpy.calls.getQuizQuestion.history,
                ).toContain(command.questionId);
            });

            it('should throw an error when no quiz related question is found', async () => {
                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    existingAnswer.id,
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, null);

                await expect(sut.execute(command)).rejects.toThrow(
                    QuizQuestionNotFoundException,
                );
            });

            it('should throw an error when given answer does not match any question answers', async () => {
                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    'not_existing_answerId',
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, existingQuestion);

                await expect(sut.execute(command)).rejects.toThrow(
                    QuizAnswerDoesNotExistException,
                );
            });

            it('should return a negative statement when given answer is incorrect', async () => {
                const incorrectAnswer = existingAnswer;

                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    incorrectAnswer.id,
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, existingQuestion);

                const result = await sut.execute(command);

                expect(result.isCorrect).toBe(false);
                expect(result.correctAnswerId).toBe(correctAnswer.id);
            });

            it('should return a positive statement when given answer is correct', async () => {
                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    correctAnswer.id,
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, existingQuestion);

                const result = await sut.execute(command);

                expect(result.isCorrect).toBe(true);
                expect(result.correctAnswerId).not.toBeDefined();
            });

            it('should publish an event when given answer is correct', async () => {
                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    correctAnswer.id,
                    existingQuestion.id,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, existingQuestion);

                await sut.execute(command);

                expect(eventBusSpy.calls.publish.count).toBe(1);

                const event = new CorrectAnswerGivenEvent(existingGame.id);
                expect(eventBusSpy.calls.publish.history).toContainEqual(event);
            });

            it('should publish an event when last game question has been answered', async () => {
                const [gameLastQuestionId] = existingGame.questionIds.slice(-1);

                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    existingAnswer.id,
                    gameLastQuestionId,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, {
                    ...existingQuestion,
                    id: gameLastQuestionId,
                });
                stubGetOnGoingGame(quizGameRepoSpy, existingGame);

                await sut.execute(command);

                expect(eventBusSpy.calls.publish.count).toBe(1);

                const event = new GameLastQuestionAnsweredEvent(
                    existingGame,
                    existingGame.score,
                );
                expect(eventBusSpy.calls.publish.history).toContainEqual(event);
            });

            it('should not publish a correct answer given event when it is last game question', async () => {
                const [gameLastQuestionId] = existingGame.questionIds.slice(-1);

                const command = new AnswerQuestionCommand(
                    existingGame.userId,
                    correctAnswer.id,
                    gameLastQuestionId,
                );

                stubGetQuizQuestion(quizQuestionRepoSpy, {
                    ...existingQuestion,
                    id: gameLastQuestionId,
                });
                stubGetOnGoingGame(quizGameRepoSpy, existingGame);

                await sut.execute(command);

                expect(eventBusSpy.calls.publish.count).toBe(1);

                const event = new CorrectAnswerGivenEvent(existingGame.id);
                expect(eventBusSpy.calls.publish.history).not.toContainEqual(
                    event,
                );
            });
        });
    });
});
