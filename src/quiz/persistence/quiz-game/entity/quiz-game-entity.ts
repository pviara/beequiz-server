import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { QuizQuestionDocument } from '../../quiz-question/entity/quiz-question-entity';

@Schema({ collection: 'quiz-game' })
export class QuizGameDocument extends Document {
    @Prop({ type: String, required: true })
    userId!: string;

    @Prop({ type: [QuizQuestionDocument], required: true })
    questions!: QuizQuestionDocument[];

    @Prop({ type: String, required: true })
    currentQuestionId!: string;

    @Prop({ type: Number, default: 0, required: true })
    score!: number;
}

export type QuizGameEntity = QuizGameDocument & Document;
export const quizGameSchema = SchemaFactory.createForClass(QuizGameDocument);

export const QUIZ_GAME_MODEL = 'QuizGame';
