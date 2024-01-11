import { AddUserRepoDTO } from '../../persistence/dto/add-user-repo.dto';
import { User } from '../../domain/user';
import { UserRepository } from '../../persistence/repository/user-repository';

export class UserRepositorySpy implements UserRepository {
    calls = {
        count: {
            add: 0,
            getById: 0,
            getByUsername: 0,
            update: 0,
        },
        history: {
            add: [] as AddUserRepoDTO[],
            getById: [] as string[],
            getByUsername: [] as string[],
            update: [] as User[],
        },
    };

    add(userToAdd: AddUserRepoDTO): Promise<void> {
        this.calls.count.add++;
        this.calls.history.add.push(userToAdd);
        return Promise.resolve();
    }

    getById(userId: string): Promise<User | null> {
        this.calls.count.getById++;
        this.calls.history.getById.push(userId);
        return Promise.resolve(null);
    }

    getByUsername(username: string): Promise<User | null> {
        this.calls.count.getByUsername++;
        this.calls.history.getByUsername.push(username);
        return Promise.resolve(null);
    }

    update(user: User): Promise<void> {
        this.calls.count.update++;
        this.calls.history.update.push(user);
        return Promise.resolve();
    }
}

export function stubGetById(
    userRepositorySpy: UserRepositorySpy,
    returnedValue: User | null,
): void {
    userRepositorySpy.getById = (userId: string): Promise<User | null> => {
        userRepositorySpy.calls.count.getById++;
        userRepositorySpy.calls.history.getById.push(userId);
        return Promise.resolve(returnedValue);
    };
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
