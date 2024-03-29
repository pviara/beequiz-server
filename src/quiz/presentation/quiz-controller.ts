import {
    AnswerQuestionCommand,
    AnswerQuestionHandler,
} from '../application/handlers/answer-question/answer-question.handler';
import { AnswerQuestionDTO } from './dto/answer-question-dto';
import { AuthenticatedRequest } from '../../auth/presentation/model/authenticated-request';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import {
    CommandBus,
    ICommand,
    ICommandHandler,
    IQuery,
    IQueryHandler,
} from '@nestjs/cqrs';
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
import {
    QuitGameCommand,
    QuitGameHandler,
} from '../application/handlers/quit-game/quit-game.handler';

type AnswerStatementDTO = ReturnType<AnswerQuestionHandler['execute']>;

@Controller()
export class QuizController {
    constructor(private commandBus: CommandBus) {}

    @UseGuards(JwtAuthGuard)
    @Post('answer')
    async answerQuestion(
        @Request() req: AuthenticatedRequest,
        @Body() dto: AnswerQuestionDTO,
    ): Promise<AnswerStatementDTO> {
        const command = new AnswerQuestionCommand(
            req.user.id,
            dto.answerId,
            dto.questionId,
        );

        return this.execute<AnswerQuestionHandler>(command);
    }

    @Get('parameters')
    async getParameters(): Promise<QuizParameters> {
        const command = new GetQuizParametersTempCommand();

        return this.execute<GetQuizParametersTempHandler>(command);
    }

    @UseGuards(JwtAuthGuard)
    @Get('questions')
    async getQuestions(
        @Request() req: AuthenticatedRequest,
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

        const command = new GetQuizQuestionsCommand(
            req.user.id,
            +amount,
            themeId,
        );

        const result = await this.execute<GetQuizQuestionsHandler>(command);

        return this.mapToQuestionsDTO(result);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async quitGame(
        @Request() req: AuthenticatedRequest,
        @Query('userId') userId: string,
    ): Promise<void> {
        const command = new QuitGameCommand(req.user.id, userId);

        await this.execute<QuitGameHandler>(command);
    }

    private execute<T extends ICommandHandler | IQueryHandler>(
        command: ICommand | IQuery,
    ) {
        return this.commandBus.execute<
            typeof command,
            ReturnType<T['execute']>
        >(command);
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
