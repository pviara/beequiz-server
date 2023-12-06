import { AppRoutingModule } from './app-routing.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [AppRoutingModule, DatabaseModule, QuizModule, UserModule],
})
export class AppModule {}
