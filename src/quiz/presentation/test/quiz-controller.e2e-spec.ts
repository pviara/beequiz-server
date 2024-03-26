import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppExceptionFilter } from '../../../application/app-exception-filter';
import { DatabaseTestingModule } from '../../../infrastructure/database/test/database.testing-module';
import { DummyOpenAIServiceImpl } from '../../../open-ai/application/services/open-ai/test/dummy-open-ai-service.impl';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { OpenAIService } from '../../../open-ai/application/services/open-ai/open-ai-service';
import { QuizTestingModule } from './quiz.testing-module';
import { RouterModule } from '@nestjs/core';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import request from 'supertest';

describe('QuizController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        let appModuleBuilder = Test.createTestingModule({
            imports: [
                DatabaseTestingModule,
                QuizTestingModule,
                RouterModule.register([
                    {
                        path: 'api',
                        children: [{ path: 'quiz', module: QuizTestingModule }],
                    },
                ]),
            ],
        });

        appModuleBuilder = overrideOpenAIService(appModuleBuilder);

        const module = await appModuleBuilder.compile();
        app = module.createNestApplication();

        app.useGlobalFilters(new AppExceptionFilter());

        await app.init();
    });

    afterAll(async () => await app.close());

    describe('getParameters', () => {
        it('should return an HTTP error status 200', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/quiz/parameters',
            );

            expect(response.status).toBe(HttpStatus.OK);
        });
    });

    describe('getQuestions', () => {
        it('should return an HTTP error status 400 when given themeId cannot be casted into ObjectId', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/quiz/questions?themeId=not_existing_themeId',
            );

            expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        });

        it('should return an HTTP error status 404 when given theme does not exist', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/quiz/questions?themeId=65687f999dd8a5d11a617ae6',
            );

            expect(response.status).toBe(HttpStatus.NOT_FOUND);
        });
    });
});

function overrideOpenAIService(
    module: TestingModuleBuilder,
): TestingModuleBuilder {
    return module
        .overrideProvider(OpenAIService)
        .useClass(DummyOpenAIServiceImpl);
}
