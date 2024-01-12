import { AppModule } from './app.module';
import {
    ALLOWED_ORIGIN,
    APP_ENVIRONMENT,
    AppEnvironment,
    ApplicationConfiguration,
} from './infrastructure/app-config/configuration/application-configuration';
import { AppConfigService } from './infrastructure/app-config/app-config-service';
import { AppExceptionFilter } from './application/app-exception-filter';
import { APP_CONFIG_SERVICE_TOKEN } from './infrastructure/app-config/app-config-service.provider';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    configureCorsPolicy(app);

    app.useGlobalFilters(new AppExceptionFilter());

    await app.listen(4002);
}

function configureCorsPolicy(app: INestApplication): void {
    const appConfig = getAppConfiguration(app);

    if (!isAppInProductionMode(appConfig)) {
        app.enableCors({
            origin: (origin, callback) => {
                const allowedOrigin = getAllowedOrigin(appConfig);
                const isOriginAllowed = !origin || allowedOrigin === origin;

                if (isOriginAllowed) {
                    callback(null, true);
                } else {
                    callback(new Error('CORS: Request origin is not allowed'));
                }
            },
        });
    } else {
        app.enableCors();
    }
}

function getAppConfiguration(app: INestApplication): ApplicationConfiguration {
    const appConfigService = app.get<AppConfigService>(
        APP_CONFIG_SERVICE_TOKEN,
    );
    return appConfigService.getAppConfig();
}

function isAppInProductionMode(appConfig: ApplicationConfiguration) {
    return appConfig[APP_ENVIRONMENT] === AppEnvironment.Production;
}

function getAllowedOrigin(appConfig: ApplicationConfiguration): string {
    return appConfig[ALLOWED_ORIGIN];
}
