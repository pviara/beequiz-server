import { Module } from '@nestjs/common';
import { QuizController } from '../quiz-controller';
import { quizModuleImports, quizModuleProviders } from '../../quiz.module';

@Module({
    controllers: [QuizController],
    imports: [...quizModuleImports],
    providers: [...quizModuleProviders],
})
export class QuizTestingModule {}
