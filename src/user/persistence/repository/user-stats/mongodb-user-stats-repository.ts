import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateUserStatsRepoDTO } from 'src/user/domain/user-stats';
import { UserStatsRepository } from './user-stats-repository';
import {
    UserStatsEntity,
    USER_STATS_MODEL,
} from '../../entity/user-stats-entity';

export class MongoDbUserStatsRepository implements UserStatsRepository {
    constructor(
        @InjectModel(USER_STATS_MODEL)
        private model: Model<UserStatsEntity>,
    ) {}

    async updateUserStats(
        userId: string,
        stats: UpdateUserStatsRepoDTO,
    ): Promise<void> {
        const entity = await this.model.findOne({
            userId: new Types.ObjectId(userId),
        });
        if (entity) {
            await this.model.findByIdAndUpdate(entity.id, {
                score: entity.score + stats.points,
                answers: entity.answers + stats.answers,
            });
        }
    }
}
