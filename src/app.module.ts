import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AppRoutingModule,
        AuthModule,
        DatabaseModule,
        QuizModule,
        UserModule,
    ],
})
export class AppModule {}
