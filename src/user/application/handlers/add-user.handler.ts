import { AddUserRepoDTO } from '../../persistence/dto/add-user-repo.dto';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { PasswordHasher } from '../../domain/password-hasher';
import { UserAlreadyExistsException } from '../errors/user-already-exists.exception';
import { UserRepository } from '../../persistence/repository/user-repository';
import { USER_REPO_TOKEN } from '../../persistence/repository/user-repository.provider';

export class AddUserCommand implements ICommand {
    constructor(
        readonly username: string,
        readonly password: string,
    ) {}
}

@CommandHandler(AddUserCommand)
export class AddUserHandler implements ICommandHandler<AddUserCommand> {
    constructor(
        @Inject(USER_REPO_TOKEN)
        private repository: UserRepository,
    ) {}

    async execute(command: AddUserCommand): Promise<void> {
        const existingUser = await this.repository.getByUsername(
            command.username,
        );
        if (existingUser) {
            throw new UserAlreadyExistsException(command.username);
        }

        const passwordHash = await new PasswordHasher(command.password).hash();
        const userToAdd = new AddUserRepoDTO(command.username, passwordHash);

        await this.repository.add(userToAdd);
    }
}
