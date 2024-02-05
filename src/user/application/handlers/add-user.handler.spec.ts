import { AddUserCommand, AddUserHandler } from '../handlers/add-user.handler';
import { AddUserRepoDTO } from '../../persistence/dto/add-user-repo.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordHasher } from '../../domain/password-hasher';
import { stubGetByUsername } from '../test/user-repository.spy';
import { User } from '../../domain/user';
import { UserAlreadyExistsException } from '../errors/user-already-exists.exception';
import { UserRepositorySpy } from '../test/user-repository.spy';

vi.mock('bcrypt');

describe('AddUserHandler', () => {
    let sut: AddUserHandler;
    let userRepositorySpy: UserRepositorySpy;

    beforeEach(() => {
        userRepositorySpy = new UserRepositorySpy();
        vi.resetAllMocks();

        sut = new AddUserHandler(userRepositorySpy);
    });

    describe('execute', () => {
        it('should call the user repository to find any user using given username', async () => {
            const command = new AddUserCommand('', '');

            await sut.execute(command);

            expect(userRepositorySpy.calls.count.getByUsername).toBe(1);
            expect(userRepositorySpy.calls.history.getByUsername).toContain(
                command.username,
            );
        });

        it('should throw an error when given username points to an existing user', async () => {
            const command = new AddUserCommand('', '');

            const dummyUser = new User('', command.username);
            stubGetByUsername(userRepositorySpy, dummyUser);

            await expect(sut.execute(command)).rejects.toThrow(
                UserAlreadyExistsException,
            );
        });

        it('should call add on user repository with the right DTO', async () => {
            const command = new AddUserCommand('', 'password');

            stubGetByUsername(userRepositorySpy, null);

            const passwordHash = await new PasswordHasher(
                command.password,
            ).hash();
            const addUser = new AddUserRepoDTO(command.username, passwordHash);

            await sut.execute(command);

            expect(userRepositorySpy.calls.count.add).toBe(1);
            expect(userRepositorySpy.calls.history.add).toContainEqual(addUser);
        });
    });
});
