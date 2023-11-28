import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuizController } from './presentation/quiz-controller';
import { QuizParserProvider } from './application/model/quiz-parser/quiz-parser.provider';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { QuizServiceProvider } from './application/services/quiz/quiz-service.provider';
import { SharedModule } from '../shared/shared.module';

@Module({
    controllers: [QuizController],
    imports: [OpenAIModule, QuizPersistenceModule, SharedModule],
    providers: [QuizParserProvider, QuizServiceProvider],
})
export class QuizModule {}
