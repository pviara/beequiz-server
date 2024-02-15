import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuizGame } from 'src/quiz/domain/quiz-game';
import { QuizGameRepository } from './quiz-game-repository';
import { QUIZ_GAME_MODEL, QuizGameEntity } from '../entity/quiz-game-entity';

@Injectable()
export class MongoDbQuizGameRepo implements QuizGameRepository {
    constructor(
        @InjectModel(QUIZ_GAME_MODEL)
        private model: Model<QuizGameEntity>,
    ) {}

    async createGame(userId: string, questionIds: string[]): Promise<void> {
        await this.model.create({
            userId: this.mapToObjectId(userId),
            questionIds: this.mapToObjectIds(questionIds),
        });
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

    private mapToObjectId(id: string): Types.ObjectId {
        return new Types.ObjectId(id);
    }

    private mapToObjectIds(ids: string[]): Types.ObjectId[] {
        return ids.map((id) => this.mapToObjectId(id));
    }
}
