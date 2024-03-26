import { UpdateUserStatsRepoDTO } from '../../../domain/user-stats';

export abstract class UserStatsRepository {
    abstract updateUserStats(
        userId: string,
        stats: UpdateUserStatsRepoDTO,
    ): Promise<void>;
}
