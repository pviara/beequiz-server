import { Controller, Inject } from '@nestjs/common';
import { QuizService } from '../application/services/quiz/quiz-service';
import { QUIZ_SERVICE_TOKEN } from '../application/services/quiz/quiz-service.provider';

@Controller()
export class QuizController {
    constructor(
        @Inject(QUIZ_SERVICE_TOKEN)
        private quizService: QuizService,
    ) {}
}
