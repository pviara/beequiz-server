import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'quiz-game' })
export class QuizGameDocument extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    userId!: string;

    @Prop({ type: [Types.ObjectId], default: [] })
    questionIds!: Types.ObjectId[];

    @Prop({ type: Number, default: 0 })
    score!: number;
}

export type QuizGameEntity = QuizGameDocument & Document;
export const quizGameSchema = SchemaFactory.createForClass(QuizGameDocument);

export const QUIZ_GAME_MODEL = 'QuizGame';
