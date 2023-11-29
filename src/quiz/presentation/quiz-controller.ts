import { Controller, Get, Inject } from '@nestjs/common';
import { QuizService } from '../application/quiz-service/quiz-service';
import { QUIZ_SERVICE_TOKEN } from '../application/quiz-service/quiz-service.provider';
import { QuizParameters } from '../domain/quiz-parameters';

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
    async question(): Promise<any[]> {
        return (
            await this.quizService.getQuizQuestions(
                '6567452ddd9a07af30a1b148',
                20,
            )
        ).map((quizQuestion) => ({
            id: quizQuestion.id,
            label: quizQuestion.label,
            answers: quizQuestion.answers.map((answer) => ({
                id: answer.id,
                label: answer.label,
            })),
        }));
    }
}
