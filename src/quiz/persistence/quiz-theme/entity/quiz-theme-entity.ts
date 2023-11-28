import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class QuizThemeDocument extends Document {
    @Prop({ required: true })
    code!: string;

    @Prop({ required: true })
    label!: string;
}

export type QuizThemeEntity = QuizThemeDocument & Document;
export const quizThemeSchema = SchemaFactory.createForClass(QuizThemeDocument);

export const QUIZ_THEME_MODEL = 'QuizTheme';
