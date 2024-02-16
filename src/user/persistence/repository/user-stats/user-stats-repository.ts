import { UpdateUserStatsRepoDTO } from '../../../domain/user-stats';

export interface UserStatsRepository {
    updateUserStats(
        userId: string,
        stats: UpdateUserStatsRepoDTO,
    ): Promise<void>;
}
