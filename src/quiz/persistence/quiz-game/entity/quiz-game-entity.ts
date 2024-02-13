import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'quiz-game' })
export class QuizGameDocument extends Document {
    @Prop({ type: String, required: true })
    userId!: string;

    @Prop({ type: [String], default: [] })
    questionIds!: string[];

    @Prop({ type: String, required: true })
    currentQuestionId!: string;

    @Prop({ type: Number, default: 0 })
    score!: number;
}

export type QuizGameEntity = QuizGameDocument & Document;
export const quizGameSchema = SchemaFactory.createForClass(QuizGameDocument);

export const QUIZ_GAME_MODEL = 'QuizGame';
