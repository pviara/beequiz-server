import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Exception, ExceptionCode } from './exception';
import { Response } from 'express';

enum HttpStatus {
    Conflict = 409,
    FailedDependency = 424,
    NotFound = 404,
    UnprocessableEntity = 422,
}

@Catch(Exception)
export class AppExceptionFilter implements ExceptionFilter {
    private exceptionMapping: Record<ExceptionCode, HttpStatus> = {
        ProblemOccurredWithOpenAI: HttpStatus.FailedDependency,
        QuizAnswerDoesNotExist: HttpStatus.UnprocessableEntity,
        QuizGameNotFound: HttpStatus.NotFound,
        QuizQuestionNotFound: HttpStatus.NotFound,
        QuizThemeNotFound: HttpStatus.NotFound,
        StillOnGoingQuizGame: HttpStatus.Conflict,
        UserAlreadyExists: HttpStatus.Conflict,
        UserNotFound: HttpStatus.NotFound,
    };

    catch(exception: Exception, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const httpStatus = this.exceptionMapping[exception.code];

        response.status(httpStatus).json({
            message: exception.message,
        });
    }
}
