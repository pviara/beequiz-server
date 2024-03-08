import { AppModule } from './app.module';
import {
    ALLOWED_ORIGIN,
    APP_PORT,
} from './infrastructure/app-config/configuration/application-configuration';
import { AppConfigService } from './infrastructure/app-config/app-config-service';
import { AppExceptionFilter } from './application/app-exception-filter';
import { APP_CONFIG_SERVICE_TOKEN } from './infrastructure/app-config/app-config-service.provider';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ForbiddenException, INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { QuizThemeRepository } from './quiz/persistence/quiz-theme/repository/quiz-theme-repository';
import { QUIZ_THEME_REPO_TOKEN } from './quiz/persistence/quiz-theme/repository/quiz-theme-repository.provider';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    configureCorsPolicy(app);
    configureGlobalFilters(app);

    await addDefaultQuizThemes(app);
    await app.listen(getAppPort(app));
}

function configureCorsPolicy(app: INestApplication): void {
    const corsOptions: CorsOptions = {};
    const logger = new Logger('CORS');

    if (isAppInProductionMode(app)) {
        logger.log('Configured CORS policy for production mode');

        corsOptions.origin = (origin, callback) => {
            const allowedOrigin = getAllowedOrigin(app);
            const isOriginAllowed = !origin || allowedOrigin === origin;

            if (isOriginAllowed) {
                callback(null, true);
            } else {
                logger.warn(`Not allowed origin spotted : ${origin}`);
                callback(
                    new ForbiddenException(
                        'CORS: Request origin is not allowed',
                    ),
                );
            }
        };
        logger.log('Configured CORS policy for production mode');
    } else {
        logger.log('Configured CORS policy for development mode');
    }

    app.enableCors(corsOptions);
}

function getAppConfigService(app: INestApplication): AppConfigService {
    const appConfigService = app.get<AppConfigService>(
        APP_CONFIG_SERVICE_TOKEN,
    );
    return appConfigService;
}

function isAppInProductionMode(app: INestApplication): boolean {
    return getAppConfigService(app).isAppInProductionMode();
}

function getAllowedOrigin(app: INestApplication): string {
    return getAppConfigService(app).getAppConfig()[ALLOWED_ORIGIN];
}

async function addDefaultQuizThemes(app: INestApplication): Promise<void> {
    const quizThemeRepo = app.get<QuizThemeRepository>(QUIZ_THEME_REPO_TOKEN);
    const quizThemes = await quizThemeRepo.getQuizThemes();
    if (quizThemes.length === 0) {
        await quizThemeRepo.saveGeneratedThemes([
            {
                code: 'sport',
                label: 'sport',
            },
            {
                code: 'geography',
                label: 'géographie',
            },
            {
                code: 'cinema',
                label: 'cinéma',
            },
            {
                code: 'music',
                label: 'musique',
            },
        ]);
    }
}

function getAppPort(app: INestApplication): string {
    return getAppConfigService(app).getAppConfig()[APP_PORT];
}

function configureGlobalFilters(app: INestApplication): void {
    app.useGlobalFilters(new AppExceptionFilter());
}
