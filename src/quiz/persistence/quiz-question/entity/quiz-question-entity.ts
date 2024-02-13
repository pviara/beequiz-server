import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true })
class QuizAnswerDocument extends Document {
    @Prop({ type: String, required: true })
    label!: string;

    @Prop({ type: Boolean, required: true })
    isCorrect!: boolean;
}

const quizAnswerSchema = SchemaFactory.createForClass(QuizAnswerDocument);

@Schema({ collection: 'quiz-question' })
export class QuizQuestionDocument extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    themeId!: Types.ObjectId;

    @Prop({ type: String, required: true })
    label!: string;

    @Prop({ type: [quizAnswerSchema], default: [] })
    answers!: QuizAnswerDocument[];
}

export type QuizQuestionEntity = QuizQuestionDocument & Document;
export const quizQuestionSchema =
    SchemaFactory.createForClass(QuizQuestionDocument);

export const QUIZ_QUESTION_MODEL = 'QuizQuestion';
