import { Controller, Inject } from '@nestjs/common';
import { QuizQuestionRepository } from '../persistence/quiz-question-repository/quiz-question-repository';
import { QUIZ_QUESTION_REPO_TOKEN } from '../persistence/quiz-question-repository/quiz-question-repository.provider';
import { QUIZ_THEME_REPO_TOKEN } from '../persistence/quiz-theme-repository/quiz-theme-repository.provider';

@Controller()
export class QuizController {
    constructor(
        @Inject(QUIZ_QUESTION_REPO_TOKEN)
        private q1: QuizQuestionRepository,

        @Inject(QUIZ_THEME_REPO_TOKEN)
        private q2: QuizQuestionRepository,
    ) {}
}
