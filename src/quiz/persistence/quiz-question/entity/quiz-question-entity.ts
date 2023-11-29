import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true })
class QuizAnswerDocument extends Document {
    @Prop({ required: true })
    label!: string;

    @Prop({ required: true })
    isCorrect!: boolean;
}

const quizAnswerSchema = SchemaFactory.createForClass(QuizAnswerDocument);

@Schema({ collection: 'quiz-question' })
export class QuizQuestionDocument extends Document {
    @Prop({ required: true })
    themeId!: Types.ObjectId;

    @Prop({ required: true })
    label!: string;

    @Prop({ type: [quizAnswerSchema], required: true, default: [] })
    answers!: QuizAnswerDocument[];
}

export type QuizQuestionEntity = QuizQuestionDocument & Document;
export const quizQuestionSchema =
    SchemaFactory.createForClass(QuizQuestionDocument);

export const QUIZ_QUESTION_MODEL = 'QuizQuestion';
