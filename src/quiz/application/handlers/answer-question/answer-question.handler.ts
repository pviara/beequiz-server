import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizAnswerDoesNotExistException } from '../../errors/quiz-answer-does-not-exist-in-question.exception';
import { QuizQuestionRepository } from '../../../persistence/quiz-question/repository/quiz-question-repository';
import { QuizQuestionNotFoundException } from '../../errors/quiz-question-not-found.exception';
import { QUIZ_QUESTION_REPO_TOKEN } from '../../../persistence/quiz-question/repository/quiz-question-repository.provider';

type AnswerStatement = {
    isCorrect: boolean;
    correctAnswerId?: string;
};

export class AnswerQuestionCommand implements ICommand {
    constructor(
        readonly answerId: string,
        readonly questionId: string,
    ) {}
}

@CommandHandler(AnswerQuestionCommand)
export class AnswerQuestionHandler
    implements ICommandHandler<AnswerQuestionCommand>
{
    private answerId!: string;
    private question!: QuizQuestion;

    constructor(
        @Inject(QUIZ_QUESTION_REPO_TOKEN)
        private repository: QuizQuestionRepository,
    ) {}

    async execute({
        answerId,
        questionId,
    }: AnswerQuestionCommand): Promise<AnswerStatement> {
        this.answerId = answerId;

        await this.getQuestion(questionId);

        if (this.isGivenAnswerCorrect()) {
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

    private async getQuestion(questionId: string): Promise<QuizQuestion> {
        const question = await this.repository.getQuizQuestion(questionId);
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

    private getQuestionCorrectAnswer(): QuizAnswer {
        return this.question.answers.find(
            (answer) => answer.isCorrect,
        ) as QuizAnswer;
    }
}
