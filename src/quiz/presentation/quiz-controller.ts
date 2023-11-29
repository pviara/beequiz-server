import { Controller, Get, Inject } from '@nestjs/common';
import { QuizService } from '../application/quiz-service/quiz-service';
import { QUIZ_SERVICE_TOKEN } from '../application/quiz-service/quiz-service.provider';
import { QuizParameters } from '../domain/quiz-parameters';
import { QuizQuestion } from '../domain/quiz-question';

@Controller()
export class QuizController {
    constructor(
        @Inject(QUIZ_SERVICE_TOKEN)
        private quizService: QuizService,
    ) {}

    @Get('parameters')
    async theme(): Promise<QuizParameters> {
        return this.quizService.getQuizParameters();
    }

    @Get('question')
    async question(): Promise<QuizQuestion[]> {
        return this.quizService.getQuizQuestions(
            '6567384ad4343caccd799497',
            10,
        );
    }
}
