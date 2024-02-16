import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, userSchema } from './entity/user-entity';
import { USER_STATS_MODEL, userStatsSchema } from './entity/user-stats-entity';
import { UserStatsRepoProvider } from './repository/user-stats/user-stats-repository.provider';
import { UserRepoProvider } from './repository/user/user-repository.provider';

@Module({
    exports: [UserRepoProvider, UserStatsRepoProvider],
    imports: [
        MongooseModule.forFeature([
            { name: USER_MODEL, schema: userSchema },
            { name: USER_STATS_MODEL, schema: userStatsSchema },
        ]),
    ],
    providers: [UserRepoProvider, UserStatsRepoProvider],
})
export class UserPersistenceModule {}
