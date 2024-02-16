import { User } from './user';

export class UserStats {
    constructor(
        readonly id: string,
        readonly userId: User['id'],
        readonly points: number,
        readonly answers: number,
    ) {}
}

export type UpdateUserStatsRepoDTO = Omit<UserStats, 'id' | 'userId'>;
