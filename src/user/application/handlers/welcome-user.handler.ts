import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserRepository } from '../../persistence/repository/user-repository';
import { UserNotFoundException } from '../errors/user-not-found.exception';
import { USER_REPO_TOKEN } from '../../persistence/repository/user-repository.provider';

export class WelcomeUserCommand implements ICommand {
    constructor(readonly userId: string) {}
}

@CommandHandler(WelcomeUserCommand)
export class WelcomeUserHandler implements ICommandHandler<WelcomeUserCommand> {
    private existingUser!: User;

    constructor(
        @Inject(USER_REPO_TOKEN)
        private repository: UserRepository,
    ) {}

    async execute({ userId }: WelcomeUserCommand): Promise<void> {
        await this.getUser(userId);
        await this.welcomeUser();
    }

    private async getUser(userId: string): Promise<void> {
        const existingUser = await this.repository.getById(userId);
        if (!existingUser) {
            throw new UserNotFoundException(userId, 'id');
        }

        this.existingUser = existingUser;
    }

    private async welcomeUser(): Promise<void> {
        const welcomedUser = new User(
            this.existingUser.id,
            this.existingUser.username,
            true,
        );

        await this.repository.update(welcomedUser);
    }
}
