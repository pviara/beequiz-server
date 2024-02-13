import { Injectable } from '@nestjs/common';
import { QuizGame } from 'src/quiz/domain/quiz-game';
import { QuizGameRepository } from './quiz-game-repository';
import { QuizQuestion } from 'src/quiz/domain/quiz-question';

@Injectable()
export class MongoDbQuizGameRepo implements QuizGameRepository {
    createGame(userId: string, questions: QuizQuestion[]): QuizGame {
        throw new Error('Method not implemented.');
    }
    deleteGame(gameId: string): void {
        throw new Error('Method not implemented.');
    }
    updateGame(game: QuizGame): void {
        throw new Error('Method not implemented.');
    }
}
