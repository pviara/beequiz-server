import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import {
    AnswerQuestionCommand,
    AnswerQuestionHandler,
} from '../application/handlers/answer-question/answer-question.handler';
import { AnswerQuestionDTO } from './dto/answer-question-dto';

type AnswerStatementDTO = ReturnType<AnswerQuestionHandler['execute']>;

@Controller()
export class QuizController {
    constructor(private commandBus: CommandBus) {}

    @Post('answer')
    async answerQuestion(
        @Body() dto: AnswerQuestionDTO,
    ): Promise<AnswerStatementDTO> {
        const command = new AnswerQuestionCommand(dto.answerId, dto.questionId);

        return this.commandBus.execute<typeof command, AnswerStatementDTO>(
            command,
        );
    }

    @Get('parameters')
    async getParameters(): Promise<QuizParameters> {
        const command = new GetQuizParametersCommand();

        return this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizParametersHandler['execute']>
        >(command);
    }

    @Get('questions')
    async getQuestions(
        @Query('themeId') themeId: string,
    ): Promise<QuizQuestionDTO[]> {
        const command = new GetQuizQuestionsCommand(10, themeId);

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
