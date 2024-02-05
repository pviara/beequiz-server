import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'quiz-theme' })
export class QuizThemeDocument extends Document {
    @Prop({ type: String, required: true })
    code!: string;

    @Prop({ type: String, required: true })
    label!: string;
}

export type QuizThemeEntity = QuizThemeDocument & Document;
export const quizThemeSchema = SchemaFactory.createForClass(QuizThemeDocument);

export const QUIZ_THEME_MODEL = 'QuizTheme';
