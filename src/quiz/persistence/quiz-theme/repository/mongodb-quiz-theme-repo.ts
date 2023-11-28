import { AnyKeys, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemeEntity, QUIZ_THEME_MODEL } from '../entity/quiz-theme-entity';
import { QuizThemeRepository } from './quiz-theme-repository';

@Injectable()
export class MongoDbQuizThemeRepo implements QuizThemeRepository {
    constructor(
        @InjectModel(QUIZ_THEME_MODEL)
        private model: Model<QuizThemeEntity>,
    ) {}

    async getQuizThemes(): Promise<QuizTheme[]> {
        const entities = await this.model.find({});
        return entities.map(
            (entity) => new QuizTheme(entity.code, entity.label),
        );
    }

    async saveGeneratedThemes(quizThemes: QuizTheme[]): Promise<QuizTheme[]> {
        const created = await this.model.create(
            ...quizThemes.map(
                (quizTheme) =>
                    ({
                        code: quizTheme.code,
                        label: quizTheme.label,
                    }) as AnyKeys<QuizThemeEntity>,
            ),
        );
        return created.map(
            (entity) => new QuizTheme(entity.code, entity.label),
        );
    }
}
