import { User } from '../../domain/user';
import { UserRepositorySpy } from './user-repository.spy';

export function stubGetByUsername(
    userRepositorySpy: UserRepositorySpy,
    returnedValue: User | null,
): void {
    userRepositorySpy.getByUsername = (
        username: string,
    ): Promise<User | null> => {
        userRepositorySpy.calls.count.getByUsername++;
        userRepositorySpy.calls.history.getByUsername.push(username);
        return Promise.resolve(returnedValue);
    };
}
