import { Injectable } from '@nestjs/common';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from './quiz-theme-repository';

@Injectable()
export class MongoDbQuizThemeRepo implements QuizThemeRepository {
    getQuizThemes(): QuizTheme[] {
        return [];
    }

    saveGeneratedThemes(quizThemes: QuizTheme[]): void {}
}
