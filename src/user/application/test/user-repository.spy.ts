import { AddUserRepoDTO } from '../../persistence/dto/add-user-repo.dto';
import { User } from '../../domain/user';
import { UserRepository } from '../../persistence/repository/user/user-repository';

export class UserRepositorySpy implements UserRepository {
    calls = {
        count: {
            add: 0,
            getById: 0,
            update: 0,
        },
        history: {
            add: [] as AddUserRepoDTO[],
            getById: [] as string[],
            update: [] as User[],
        },
    };

    add(userToAdd: AddUserRepoDTO): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getByEmail(email: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    getById(userId: string): Promise<User | null> {
        this.calls.count.getById++;
        this.calls.history.getById.push(userId);
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
