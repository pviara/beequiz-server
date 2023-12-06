import { AddUserRepoDTO } from '../../persistence/dto/add-user-repo.dto';
import { User } from '../../domain/user';
import { UserRepository } from '../../persistence/repository/user-repository';

export class UserRepositorySpy implements UserRepository {
    calls = {
        count: {
            add: 0,
            getByUsername: 0,
        },
        history: {
            add: [] as AddUserRepoDTO[],
            getByUsername: [] as string[],
        },
    };

    add(userToAdd: AddUserRepoDTO): Promise<void> {
        this.calls.count.add++;
        this.calls.history.add.push(userToAdd);
        return Promise.resolve();
    }

    getByUsername(username: string): Promise<User | null> {
        this.calls.count.getByUsername++;
        this.calls.history.getByUsername.push(username);
        return Promise.resolve(null);
    }
}

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
