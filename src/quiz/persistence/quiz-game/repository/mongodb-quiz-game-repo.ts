import { Injectable } from '@nestjs/common';
import { QuizGame } from 'src/quiz/domain/quiz-game';
import { QuizGameRepository } from './quiz-game-repository';

@Injectable()
export class MongoDbQuizGameRepo implements QuizGameRepository {
    createGame(userId: string, questionIds: string[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteGame(gameId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getOnGoingGame(userId: string): Promise<QuizGame | null> {
        throw new Error('Method not implemented.');
    }
    increaseGameScore(gameId: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
