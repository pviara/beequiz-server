import { AppRoutingModule } from './app-routing.module';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';

@Module({
    imports: [AppRoutingModule, QuizModule],
})
export class AppModule {}
