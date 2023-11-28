import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeEntity, QUIZ_THEME_MODEL } from '../entity/quiz-theme-entity';
import { QuizThemeRepository } from './quiz-theme-repository';

@Injectable()
export class MongoDbQuizThemeRepo implements QuizThemeRepository {
    constructor(
        @InjectModel(QUIZ_THEME_MODEL)
        private model: Model<QuizThemeEntity>,
    ) {}

    getQuizThemes(): QuizTheme[] {
        return [];
    }

    saveGeneratedThemes(quizThemes: QuizTheme[]): void {}
}
