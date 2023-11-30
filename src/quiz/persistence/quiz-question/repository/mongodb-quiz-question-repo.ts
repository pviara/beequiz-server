import { AnyKeys, Model, PipelineStage, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParsedQuizQuestion } from '../../../application/quiz-parser/model/parsed-quiz-question';
import { QuizAnswer, QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from './quiz-question-repository';
import {
    QuizQuestionEntity,
    QUIZ_QUESTION_MODEL,
} from '../entity/quiz-question-entity';

@Injectable()
export class MongoDbQuizQuestionRepo implements QuizQuestionRepository {
    constructor(
        @InjectModel(QUIZ_QUESTION_MODEL)
        private model: Model<QuizQuestionEntity>,
    ) {}

    async getQuizQuestions(
        numberOfQuestions: number,
        themeId: string,
    ): Promise<QuizQuestion[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    themeId: new Types.ObjectId(themeId),
                },
            },
            {
                $sample: {
                    size: numberOfQuestions,
                },
            },
        ];

        const entities = await this.model.aggregate(pipeline).exec();
        return this.mapToQuestions(entities);
    }

    async saveGeneratedQuestions(
        quizQuestions: ParsedQuizQuestion[],
        themeId: string,
    ): Promise<QuizQuestion[]> {
        const created = await this.model.create(
            ...quizQuestions.map(
                (quizQuestion) =>
                    ({
                        themeId: new Types.ObjectId(themeId),
                        label: quizQuestion.label,
                        answers: quizQuestion.answers.map(
                            (quizAnswer) =>
                                ({
                                    label: quizAnswer.label,
                                    isCorrect: quizAnswer.isCorrect,
                                }) as AnyKeys<
                                    QuizQuestionEntity['answers'][any]
                                >,
                        ),
                    }) as AnyKeys<QuizQuestionEntity>,
            ),
        );
        return this.mapToQuestions(created);
    }

    private mapToQuestions(entities: QuizQuestionEntity[]): QuizQuestion[] {
        return entities.map((entity) => this.mapToQuestion(entity));
    }

    private mapToQuestion(entity: QuizQuestionEntity): QuizQuestion {
        return new QuizQuestion(
            entity._id,
            entity.label,
            this.mapToAnswer(entity),
        );
    }

    private mapToAnswer(entity: QuizQuestionEntity): QuizAnswer[] {
        return entity.answers.map(
            (answerEntity) =>
                new QuizAnswer(
                    answerEntity._id,
                    answerEntity.label,
                    answerEntity.isCorrect,
                ),
        );
    }
}
