import { CqrsModule } from '@nestjs/cqrs';
import { GetQuizParametersHandler } from './application/handlers/get-quiz-parameters.handler';
import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuizController } from './presentation/quiz-controller';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { QuizServiceProvider } from './application/quiz-service/quiz-service.provider';
import { SharedModule } from '../shared/shared.module';

const commandHandlers = [GetQuizParametersHandler];

@Module({
    controllers: [QuizController],
    imports: [CqrsModule, OpenAIModule, QuizPersistenceModule, SharedModule],
    providers: [...commandHandlers, QuizServiceProvider],
})
export class QuizModule {}
