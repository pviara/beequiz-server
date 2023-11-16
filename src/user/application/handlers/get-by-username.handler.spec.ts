import {
    GetByUsernameHandler,
    GetByUsernameQuery,
} from './get-by-username.handler';
import { stubGetByUsername } from '../test/utils';
import { User } from '../../domain/user';
import { UserNotFoundException } from '../errors/user-not-found.exception';
import { UserRepositorySpy } from '../test/user-repository.spy';

describe('GetByUsernameHandler', () => {
    let sut: GetByUsernameHandler;
    let userRepositorySpy: UserRepositorySpy;

    beforeEach(() => {
        userRepositorySpy = new UserRepositorySpy();
        sut = new GetByUsernameHandler(userRepositorySpy);
    });

    describe('execute', () => {
        it('should call the user repository to find user by its username', async () => {
            const username = 'username';
            const query = new GetByUsernameQuery(username);

            const dummyUser = new User('', '');
            stubGetByUsername(userRepositorySpy, dummyUser);

            await sut.execute(query);

            expect(userRepositorySpy.calls.count.getByUsername).toBe(1);
            expect(userRepositorySpy.calls.history.getByUsername).toContain(
                username,
            );
        });

        it('should throw an error when no user has been found using given username', async () => {
            const username = 'username';
            const query = new GetByUsernameQuery(username);

            stubGetByUsername(userRepositorySpy, null);

            await expect(sut.execute(query)).rejects.toThrow(
                UserNotFoundException,
            );
        });

        it('should return the user who has been found using given username', async () => {
            const username = 'username';
            const query = new GetByUsernameQuery(username);

            const dummyUser = new User('id', username);
            stubGetByUsername(userRepositorySpy, dummyUser);

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(User);
            expect(result.id).toBe(dummyUser.id);
            expect(result.username).toBe(dummyUser.username);
        });
    });
});
