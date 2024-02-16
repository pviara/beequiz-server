import { UpdateUserStatsRepoDTO } from '../../domain/user-stats';
import { UserStatsRepository } from '../../persistence/repository/user-stats/user-stats-repository';

export class UserStatsRepositorySpy implements UserStatsRepository {
    calls = {
        updateUserStats: {
            count: 0,
            history: [] as [string, UpdateUserStatsRepoDTO][],
        },
    };

    async updateUserStats(
        userId: string,
        stats: UpdateUserStatsRepoDTO,
    ): Promise<void> {
        this.calls.updateUserStats.count++;
        this.calls.updateUserStats.history.push([userId, stats]);
    }
}
