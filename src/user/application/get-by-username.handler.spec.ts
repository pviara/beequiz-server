import {
    GetByUsernameHandler,
    GetByUsernameQuery,
} from './get-by-username.handler';
import { User } from '../domain/user';
import { UserNotFoundException } from './errors/user-not-found.exception';
import { UserRepository } from '../persistence/user-repository';

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

            expect(userRepositorySpy.callCounts).toBe(1);
            expect(userRepositorySpy.callHistory).toContain(username);
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

class UserRepositorySpy implements UserRepository {
    callCounts = 0;
    callHistory: string[] = [];

    getByUsername(username: string): Promise<User | null> {
        this.callCounts++;
        this.callHistory.push(username);
        return null;
    }
}

function stubGetByUsername(
    userRepositorySpy: UserRepositorySpy,
    returnedValue: User | null,
): void {
    userRepositorySpy.getByUsername = (
        username: string,
    ): Promise<User | null> => {
        userRepositorySpy.callCounts++;
        userRepositorySpy.callHistory.push(username);
        return Promise.resolve(returnedValue);
    };
}
