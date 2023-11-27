import { Injectable } from '@nestjs/common';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemeRepository } from './quiz-theme-repository';

@Injectable()
export class MongoDbQuizThemeRepo implements QuizThemeRepository {
    getQuizThemes(): QuizTheme[] {
        throw new Error('Method not implemented.');
    }

    saveGeneratedThemes(quizThemes: QuizTheme[]): void {
        throw new Error('Method not implemented.');
    }
}
