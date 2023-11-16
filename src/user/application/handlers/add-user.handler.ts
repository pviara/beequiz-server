import { AddUserRepoDTO } from '../../persistence/add-user-repo.dto';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PasswordHasher } from '../../domain/password-hasher';
import { UserAlreadyExistsException } from '../errors/user-already-exists.exception';
import { UserRepository } from '../../persistence/user-repository';

export class AddUserCommand implements ICommand {
    constructor(
        readonly username: string,
        readonly password: string,
    ) {}
}

@CommandHandler(AddUserCommand)
export class AddUserHandler implements ICommandHandler<AddUserCommand> {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(command: AddUserCommand): Promise<void> {
        const existingUser = await this.userRepository.getByUsername(
            command.username,
        );
        if (existingUser) {
            throw new UserAlreadyExistsException(command.username);
        }

        const { passwordHash } = new PasswordHasher(command.password);
        const userToAdd = new AddUserRepoDTO(command.username, passwordHash);

        await this.userRepository.add(userToAdd);
    }
}
