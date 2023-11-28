import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuizController } from './presentation/quiz-controller';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { QuizServiceProvider } from './application/quiz-service/quiz-service.provider';
import { SharedModule } from '../shared/shared.module';

@Module({
    controllers: [QuizController],
    imports: [OpenAIModule, QuizPersistenceModule, SharedModule],
    providers: [QuizServiceProvider],
})
export class QuizModule {}
