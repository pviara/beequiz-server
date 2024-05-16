import { AddUserRepoDTO } from '../persistence/dto/add-user-repo.dto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AuthService } from '../../auth/application/auth-service';
import { createApplicationFrom } from '../../../test/utils';
import { DatabaseTestingModule } from '../../infrastructure/database/test/database.testing-module';
import { HttpStatus, INestApplication, Module } from '@nestjs/common';
import request from 'supertest';
import { SignedInUser } from '../../auth/domain/signed-in-user';
import { User } from '../domain/user';
import { UserModule } from '../user.module';
import { UserRepository } from '../persistence/repository/user/user-repository';

@Module({
    imports: [DatabaseTestingModule, UserModule],
})
class UserTestingModule {}

describe('UserController', () => {
    let app: INestApplication;

    let signedInUser: SignedInUser;

    beforeAll(async () => {
        app = await createApplicationFrom(UserTestingModule);
        await app.init();

        signedInUser = await createAuthenticatedUserIn(app);
    });

    afterAll(async () => await app.close());

    describe('PATCH /welcome', () => {
        it('should throw an HTTP 401 error when client is not authenticated', async () => {
            const response = await request(app.getHttpServer()).patch(
                '/welcome',
            );
            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });

        it('should welcome the authenticated user properly', async () => {
            const response = await request(app.getHttpServer())
                .patch('/welcome')
                .set('Authorization', `Bearer ${signedInUser.token}`);

            expect(response.status).toBe(HttpStatus.OK);

            const updatedUser = await getUserByEmailFrom(app, 'test@email.com');
            expect(updatedUser?.hasBeenWelcomed).toBe(true);
        });
    });
});

async function createAuthenticatedUserIn(
    app: INestApplication,
): Promise<SignedInUser> {
    const dummyUser = await addUserIn(app, 'test@email.com');
    return authenticateIn(app, dummyUser);
}

async function addUserIn(app: INestApplication, email: string): Promise<User> {
    const userRepository = app.get(UserRepository);
    await userRepository.add(new AddUserRepoDTO(email));

    const created = await userRepository.getByEmail(email);
    if (created) {
        return created;
    }

    throw new Error(
        'User could not be created and thus tests cannot be performed',
    );
}

function authenticateIn(app: INestApplication, user: User): SignedInUser {
    const authService = app.get(AuthService);
    return authService.signIn({
        id: user.id,
        email: 'test@email.com',
        hasBeenWelcomed: user.hasBeenWelcomed,
    });
}

async function getUserByEmailFrom(
    app: INestApplication,
    email: string,
): Promise<User | null> {
    const userRepository = app.get(UserRepository);
    return userRepository.getByEmail(email);
}
