import { Controller, Get, Inject } from '@nestjs/common';
import { QuizService } from '../application/services/quiz/quiz-service';
import { QUIZ_SERVICE_TOKEN } from '../application/services/quiz/quiz-service.provider';
import { QuizParameters } from '../domain/quiz-parameters';

@Controller()
export class QuizController {
    constructor(
        @Inject(QUIZ_SERVICE_TOKEN)
        private quizService: QuizService,
    ) {}

    @Get()
    async method(): Promise<QuizParameters> {
        return this.quizService.getQuizParameters();
    }
}
