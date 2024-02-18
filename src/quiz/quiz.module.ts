import { AnswerQuestionHandler } from './application/handlers/answer-question/answer-question.handler';
import { CorrectAnswerGivenHandler } from './application/handlers/correct-answer-given/correct-answer-given.event-handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GameLastQuestionAnsweredHandler } from './application/handlers/game-last-question-answered/game-last-question-answered.handler';
import { GetQuizParametersTempHandler } from './application/handlers/get-quiz-parameters-tmp/get-quiz-parameters-tmp.handler';
import { GetQuizQuestionsHandler } from './application/handlers/get-quiz-questions/get-quiz-questions.handler';
import { Module } from '@nestjs/common';
import { OpenAIModule } from '../open-ai/open-ai.module';
import { QuestionsRetrievedHandler } from './application/handlers/questions-retrieved/questions-retrieved.event-handler';
import { QuitGameHandler } from './application/handlers/quit-game/quit-game.handler';
import { QuizController } from './presentation/quiz-controller';
import { QuizPersistenceModule } from './persistence/quiz-persistence.module';
import { SharedModule } from '../shared/shared.module';
import { UserPersistenceModule } from '../user/persistence/user.persistence-module';

export const quizModuleProviders = [
    AnswerQuestionHandler,
    CorrectAnswerGivenHandler,
    GameLastQuestionAnsweredHandler,
    GetQuizParametersTempHandler,
    GetQuizQuestionsHandler,
    QuestionsRetrievedHandler,
    QuitGameHandler,
];

export const quizModuleImports = [
    CqrsModule,
    OpenAIModule,
    QuizPersistenceModule,
    SharedModule,
    UserPersistenceModule,
];

@Module({
    controllers: [QuizController],
    imports: [...quizModuleImports],
    providers: [...quizModuleProviders],
})
export class QuizModule {}
