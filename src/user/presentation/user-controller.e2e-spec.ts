import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApplicationFrom } from '../../../test/utils';
import { DatabaseTestingModule } from '../../infrastructure/database/test/database.testing-module';
import { HttpStatus, INestApplication, Module } from '@nestjs/common';
import request from 'supertest';
import { UserModule } from '../user.module';

@Module({
    imports: [DatabaseTestingModule, UserModule],
})
class UserTestingModule {}

describe('UserController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createApplicationFrom(UserTestingModule);
        await app.init();
    });

    afterAll(async () => await app.close());

    describe('PATCH /welcome', () => {
        it('should throw an HTTP error 401 when client is not authenticated', async () => {
            const response = await request(app.getHttpServer()).patch(
                '/welcome',
            );
            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});
