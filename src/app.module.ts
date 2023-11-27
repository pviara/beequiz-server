import { AppRoutingModule } from './app-routing.module';
import { DateTimeServiceProvider } from './application/date-time-service.provider';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';

@Module({
    imports: [AppRoutingModule, QuizModule],
})
export class AppModule {}
