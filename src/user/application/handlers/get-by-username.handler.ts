import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain/user';
import { UserNotFoundException } from '../errors/user-not-found.exception';
import { UserRepository } from '../../persistence/repository/user-repository';
import { USER_REPO_TOKEN } from '../../persistence/repository/user-repository.provider';

export class GetByUsernameQuery implements IQuery {
    constructor(readonly username: string) {}
}

@QueryHandler(GetByUsernameQuery)
export class GetByUsernameHandler implements IQueryHandler<GetByUsernameQuery> {
    constructor(
        @Inject(USER_REPO_TOKEN)
        private repository: UserRepository,
    ) {}

    async execute(query: GetByUsernameQuery): Promise<User> {
        const existingUser = await this.repository.getByUsername(
            query.username,
        );
        if (!existingUser) {
            throw new UserNotFoundException(query.username, 'username');
        }
        return existingUser;
    }
}
