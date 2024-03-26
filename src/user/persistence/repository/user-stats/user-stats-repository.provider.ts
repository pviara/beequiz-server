import { Provider } from '@nestjs/common';
import { MongoDbUserStatsRepository } from './mongodb-user-stats-repository';
import { UserStatsRepository } from './user-stats-repository';

export const UserStatsRepoProvider: Provider = {
    provide: UserStatsRepository,
    useClass: MongoDbUserStatsRepository,
};
