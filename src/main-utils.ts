import { AppModule } from './app.module';
import {
    ALLOWED_ORIGIN,
    APP_ENVIRONMENT,
    APP_PORT,
    AppEnvironment,
    ApplicationConfiguration,
} from './infrastructure/app-config/configuration/application-configuration';
import { AppConfigService } from './infrastructure/app-config/app-config-service';
import { AppExceptionFilter } from './application/app-exception-filter';
import { APP_CONFIG_SERVICE_TOKEN } from './infrastructure/app-config/app-config-service.provider';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ForbiddenException, INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    configureCorsPolicy(app);
    configureGlobalFilters(app);

    await app.listen(getAppPort(app));
}

function configureCorsPolicy(app: INestApplication): void {
    const corsOptions: CorsOptions = {};
    const logger = new Logger('CORS');

    if (isAppInProductionMode(app)) {
        logger.log('Configuring CORS policy for production mode');

        corsOptions.origin = (origin, callback) => {
            const allowedOrigin = getAllowedOrigin(app);
            const isOriginAllowed = allowedOrigin === origin;

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
    } else {
        logger.log('Configuring CORS policy for development mode');
    }

    app.enableCors(corsOptions);
}

function getAppConfiguration(app: INestApplication): ApplicationConfiguration {
    const appConfigService = app.get<AppConfigService>(
        APP_CONFIG_SERVICE_TOKEN,
    );
    return appConfigService.getAppConfig();
}

function isAppInProductionMode(app: INestApplication) {
    const appConfig = getAppConfiguration(app);
    return appConfig[APP_ENVIRONMENT] === AppEnvironment.Production;
}

function getAllowedOrigin(app: INestApplication): string {
    const appConfig = getAppConfiguration(app);
    return appConfig[ALLOWED_ORIGIN];
}

function getAppPort(app: INestApplication): string {
    const appConfig = getAppConfiguration(app);
    return appConfig[APP_PORT];
}

function configureGlobalFilters(app: INestApplication): void {
    app.useGlobalFilters(new AppExceptionFilter());
}
