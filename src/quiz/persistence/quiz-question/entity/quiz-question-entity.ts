import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class QuizAnswerDocument extends Document {
    @Prop({ required: true })
    label!: string;

    @Prop({ required: true })
    isCorrect!: boolean;
}

@Schema()
export class QuizQuestionDocument extends Document {
    @Prop({ required: true })
    label!: string;

    @Prop({ required: true, default: [] })
    answers!: QuizAnswerDocument[];
}

export type QuizQuestionEntity = QuizQuestionDocument & Document;
export const quizQuestionSchema =
    SchemaFactory.createForClass(QuizQuestionDocument);

export const QUIZ_QUESTION_MODEL = 'QuizQuestion';
