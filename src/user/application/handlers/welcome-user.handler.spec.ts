import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../../domain/user';
import { UserNotFoundException } from '../errors/user-not-found.exception';
import { UserRepositorySpy, stubGetById } from '../test/user-repository.spy';
import { WelcomeUserCommand, WelcomeUserHandler } from './welcome-user.handler';

describe('WelcomeUserHandler', () => {
    let sut: WelcomeUserHandler;
    let userRepoSpy: UserRepositorySpy;

    beforeEach(() => {
        userRepoSpy = new UserRepositorySpy();
        sut = new WelcomeUserHandler(userRepoSpy);
    });

    describe('execute', () => {
        it('should throw an error when given userId does not point to any existing user', async () => {
            const userId = 'not_existing_userId';
            const command = new WelcomeUserCommand(userId);

            stubGetById(userRepoSpy, null);

            await expect(() => sut.execute(command)).rejects.toThrow(
                UserNotFoundException,
            );

            expect(userRepoSpy.calls.count.getById).toBe(1);
            expect(userRepoSpy.calls.history.getById).toContain(userId);
        });

        it('should mark the user as welcomed once it has been retrieved', async () => {
            const userId = 'userId';
            const command = new WelcomeUserCommand(userId);

            const existingUser = new User(userId, 'username');
            stubGetById(userRepoSpy, existingUser);

            await sut.execute(command);

            expect(userRepoSpy.calls.count.update).toBe(1);

            const hasBeenWelcomed = true;
            expect(userRepoSpy.calls.history.update).toContainEqual(
                new User(existingUser.id, existingUser.email, hasBeenWelcomed),
            );
        });
    });
});
