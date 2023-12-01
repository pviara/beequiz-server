import { AnswerQuestionHandler } from './application/handlers/answer-question/answer-question.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GetQuizParametersHandler } from './application/handlers/get-quiz-parameters/get-quiz-parameters.handler';
import { GetQuizQuestionsHandler } from './application/handlers/get-quiz-questions/get-quiz-questions.handler';
import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuizController } from './presentation/quiz-controller';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { SharedModule } from '../shared/shared.module';

export const quizModuleProviders = [
    AnswerQuestionHandler,
    GetQuizParametersHandler,
    GetQuizQuestionsHandler,
];

export const quizModuleImports = [
    CqrsModule,
    OpenAIModule,
    QuizPersistenceModule,
    SharedModule,
];

@Module({
    controllers: [QuizController],
    imports: [...quizModuleImports],
    providers: [...quizModuleProviders],
})
export class QuizModule {}
