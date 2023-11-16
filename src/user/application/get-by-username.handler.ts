import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from '../domain/user';
import { UserNotFoundException } from './errors/user-not-found.exception';
import { UserRepository } from '../persistence/user-repository';

export class GetByUsernameQuery implements IQuery {
    constructor(readonly username: string) {}
}

@QueryHandler(GetByUsernameQuery)
export class GetByUsernameHandler implements IQueryHandler<GetByUsernameQuery> {
    constructor(private readonly repo: UserRepository) {}

    async execute(query: GetByUsernameQuery): Promise<User> {
        const existingUser = await this.repo.getByUsername(query.username);
        if (!existingUser) {
            throw new UserNotFoundException(query.username);
        }
        return existingUser;
    }
}
