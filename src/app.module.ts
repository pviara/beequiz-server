import { AppRoutingModule } from './app-routing.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';

@Module({
    imports: [AppRoutingModule, DatabaseModule, QuizModule],
})
export class AppModule {}
