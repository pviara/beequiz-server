import {
    AnswerQuestionCommand,
    AnswerQuestionHandler,
} from '../application/handlers/answer-question/answer-question.handler';
import { AnswerQuestionDTO } from './dto/answer-question-dto';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    GetQuizParametersTempCommand,
    GetQuizParametersTempHandler,
} from '../application/handlers/get-quiz-parameters-tmp/get-quiz-parameters-tmp.handler';
import {
    GetQuizQuestionsCommand,
    GetQuizQuestionsHandler,
} from '../application/handlers/get-quiz-questions/get-quiz-questions.handler';
import { isParsedStringNaN } from '../../utils/utils';
import { isValidObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/presentation/guards/jwt-auth-guard';
import { QuizAnswerDTO, QuizQuestionDTO } from './dto/quiz-question-dto';
import { QuizParameters } from '../domain/quiz-parameters';
import { QuizQuestion } from '../domain/quiz-question';

type AnswerStatementDTO = ReturnType<AnswerQuestionHandler['execute']>;

@Controller()
export class QuizController {
    constructor(private commandBus: CommandBus) {}

    @UseGuards(JwtAuthGuard)
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
        const command = new GetQuizParametersTempCommand();

        return this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizParametersTempHandler['execute']>
        >(command);
    }

    @UseGuards(JwtAuthGuard)
    @Get('questions')
    async getQuestions(
        @Query('amount') amount: string,
        @Query('themeId') themeId: string,
    ): Promise<QuizQuestionDTO[]> {
        if (isParsedStringNaN(amount)) {
            throw new BadRequestException(
                'Given number of questions is not a number.',
            );
        }

        if (!isValidObjectId(themeId)) {
            throw new BadRequestException(
                'Given theme id is not a valid ObjectId.',
            );
        }

        const command = new GetQuizQuestionsCommand(+amount, themeId);

        const result = await this.commandBus.execute<
            typeof command,
            ReturnType<GetQuizQuestionsHandler['execute']>
        >(command);

        return result;
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
