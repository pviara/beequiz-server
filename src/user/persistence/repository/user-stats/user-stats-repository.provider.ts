import { Provider } from '@nestjs/common';
import { MongoDbUserStatsRepository } from './mongodb-user-stats-repository';

export const USER_STATS_REPO_TOKEN = 'USER_STATS_REPO_TOKEN';

export const UserStatsRepoProvider: Provider = {
    provide: USER_STATS_REPO_TOKEN,
    useClass: MongoDbUserStatsRepository,
};
