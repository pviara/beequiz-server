import { CqrsModule } from '@nestjs/cqrs';
import { GetQuizParametersHandler } from './application/handlers/get-quiz-parameters/get-quiz-parameters.handler';
import { GetQuizQuestionsHandler } from './application/handlers/get-quiz-questions/get-quiz-questions.handler';
import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuizController } from './presentation/quiz-controller';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { SharedModule } from '../shared/shared.module';

const commandHandlers = [GetQuizParametersHandler, GetQuizQuestionsHandler];

@Module({
    controllers: [QuizController],
    imports: [CqrsModule, OpenAIModule, QuizPersistenceModule, SharedModule],
    providers: [...commandHandlers],
})
export class QuizModule {}
