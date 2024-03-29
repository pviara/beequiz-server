import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../../domain/user';
import { UserRepository } from '../../persistence/repository/user/user-repository';
import { UserNotFoundException } from '../errors/user-not-found.exception';

export class WelcomeUserCommand implements ICommand {
    constructor(readonly userId: string) {}
}

@CommandHandler(WelcomeUserCommand)
export class WelcomeUserHandler implements ICommandHandler<WelcomeUserCommand> {
    private existingUser!: User;

    constructor(private repository: UserRepository) {}

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
        this.existingUser.welcome();
        await this.repository.update(this.existingUser);
    }
}
