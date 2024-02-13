import {
    CommandHandler,
    EventBus,
    ICommand,
    ICommandHandler,
} from '@nestjs/cqrs';
import { CorrectAnswerGivenEvent } from '../../events/correct-answer-given.event';
import { Inject } from '@nestjs/common';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizAnswerDoesNotExistException } from '../../errors/quiz-answer-does-not-exist-in-question.exception';
import { QuizGame } from '../../../domain/quiz-game';
import { QuizGameDoestNotExistException } from '../../errors/quiz-game-does-not-exist.exception';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizQuestionNotFoundException } from '../../errors/quiz-question-not-found.exception';
import { QUIZ_GAME_REPO_TOKEN } from 'src/quiz/persistence/quiz-game/repository/quiz-game-repository.provider';
import { QUIZ_QUESTION_REPO_TOKEN } from '../../../persistence/quiz-question/repository/quiz-question-repository.provider';

type AnswerStatement = {
    isCorrect: boolean;
    correctAnswerId?: string;
};

export class AnswerQuestionCommand implements ICommand {
    constructor(
        readonly userId: string,
        readonly answerId: string,
        readonly questionId: string,
    ) {}
}

@CommandHandler(AnswerQuestionCommand)
export class AnswerQuestionHandler
    implements ICommandHandler<AnswerQuestionCommand>
{
    private answerId!: string;
    private game!: QuizGame;
    private question!: QuizQuestion;

    constructor(
        private eventBus: EventBus,

        @Inject(QUIZ_GAME_REPO_TOKEN)
        private gameRepo: QuizGameRepository,

        @Inject(QUIZ_QUESTION_REPO_TOKEN)
        private questionRepo: QuizQuestionRepository,
    ) {}

    async execute({
        userId,
        answerId,
        questionId,
    }: AnswerQuestionCommand): Promise<AnswerStatement> {
        await this.getGame(userId);

        this.answerId = answerId;

        await this.getQuestion(questionId);

        if (this.isGivenAnswerCorrect()) {
            this.fireCorrectAnswerGivenEvent();

            return {
                isCorrect: true,
            };
        }

        const correctAnswer = this.getQuestionCorrectAnswer();

        return {
            isCorrect: false,
            correctAnswerId: correctAnswer.id,
        };
    }

    private async getGame(userId: string): Promise<void> {
        const game = await this.gameRepo.getOnGoingGame(userId);
        if (!game) {
            throw new QuizGameDoestNotExistException(userId);
        }
        this.game = game;
    }

    private async getQuestion(questionId: string): Promise<QuizQuestion> {
        const question = await this.questionRepo.getQuizQuestion(questionId);
        if (!question) {
            throw new QuizQuestionNotFoundException(questionId);
        }

        this.question = question;
        return question;
    }

    private isGivenAnswerCorrect(): boolean {
        return this.getQuestionRelatedAnswer().isCorrect;
    }

    private getQuestionRelatedAnswer(): QuizAnswer {
        const relatedAnswer = this.question.answers.find(
            (answer) => answer.id === this.answerId,
        );
        if (!relatedAnswer) {
            throw new QuizAnswerDoesNotExistException(
                this.answerId,
                this.question.id,
            );
        }

        return relatedAnswer;
    }

    private fireCorrectAnswerGivenEvent(): void {
        const event = new CorrectAnswerGivenEvent(this.game.id);
        this.eventBus.publish(event);
    }

    private getQuestionCorrectAnswer(): QuizAnswer {
        return this.question.answers.find(
            (answer) => answer.isCorrect,
        ) as QuizAnswer;
    }
}
