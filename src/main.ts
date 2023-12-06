import { AppExceptionFilter } from './application/app-exception-filter';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AppExceptionFilter());

    app.enableCors();

    await app.listen(3000);
}
bootstrap();
