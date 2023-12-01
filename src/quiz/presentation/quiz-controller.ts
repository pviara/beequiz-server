import { CommandBus } from '@nestjs/cqrs';
import { Controller, Get } from '@nestjs/common';
import { QuizParameters } from '../domain/quiz-parameters';
import {
    GetQuizParametersCommand,
    GetQuizParametersHandler,
} from '../application/handlers/get-quiz-parameters/get-quiz-parameters.handler';
import {
    GetQuizQuestionsCommand,
    GetQuizQuestionsHandler,
} from '../application/handlers/get-quiz-questions/get-quiz-questions.handler';
import { QuizAnswerDTO, QuizQuestionDTO } from './dto/quiz-question-dto';
import { QuizQuestion } from '../domain/quiz-question';

@Controller()
export class QuizController {
    constructor(private commandBus: CommandBus) {}

    @Get('parameters')
    async theme(): Promise<QuizParameters> {
        const command = new GetQuizParametersCommand();

        return this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizParametersHandler['execute']>
        >(command);
    }

    @Get('questions')
    async question(): Promise<QuizQuestionDTO[]> {
        const command = new GetQuizQuestionsCommand(
            10,
            '65687f995dd8a5d11a617aee',
        );

        const result = await this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizQuestionsHandler['execute']>
        >(command);

        return this.mapToQuestionsDTO(result);
    }

    private mapToQuestionsDTO(questions: QuizQuestion[]): QuizQuestionDTO[] {
        return questions.map(
            (question) =>
                new QuizQuestionDTO(
                    question.id,
                    question.label,
                    question.answers.map(
                        (answer) => new QuizAnswerDTO(answer.id, answer.label),
                    ),
                ),
        );
    }
}
