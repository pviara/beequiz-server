import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjectIds } from '../object-ids';
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

    async getOnGoingGame(userId: string): Promise<QuizGame | null> {
        const entity = await this.model.findOne({
            userId: new Types.ObjectId(userId),
        });
        if (entity) {
            const questionIds = new ObjectIds(entity.questionIds).toStrings();

            return new QuizGame(
                entity.id,
                entity.userId,
                questionIds,
                entity.score,
            );
        }
        return null;
    }

    async increaseGameScore(gameId: string): Promise<void> {
        const entity = await this.model.findById(gameId);
        if (entity) {
            await this.model.findByIdAndUpdate(gameId, {
                score: entity.score + 1,
            });
        }
    }

    private mapToObjectId(id: string): Types.ObjectId {
        return new Types.ObjectId(id);
    }

    private mapToObjectIds(ids: string[]): Types.ObjectId[] {
        return ids.map((id) => this.mapToObjectId(id));
    }
}
