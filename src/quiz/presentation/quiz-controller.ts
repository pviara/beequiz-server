import { CommandBus } from '@nestjs/cqrs';
import { Controller, Get } from '@nestjs/common';
import { QuizParameters } from '../domain/quiz-parameters';
import {
    GetQuizParametersCommand,
    GetQuizParametersHandler,
} from '../application/handlers/get-quiz-parameters.handler';
import {
    GetQuizQuestionsCommand,
    GetQuizQuestionsHandler,
} from '../application/handlers/get-quiz-questions.handler';

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
    async question(): Promise<any[]> {
        const command = new GetQuizQuestionsCommand(
            10,
            '65687f995dd8a5d11a617ae8',
        );

        return this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizQuestionsHandler['execute']>
        >(command);
    }
}
