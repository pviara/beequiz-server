import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Exception, ExceptionCode } from './exception';
import { Response } from 'express';

enum HttpStatus {
    Conflict = 409,
    NotFound = 404,
    UnprocessableEntity = 422,
}

@Catch(Exception)
export class AppExceptionFilter implements ExceptionFilter {
    private exceptionMapping: Record<ExceptionCode, HttpStatus> = {
        [ExceptionCode.ProblemOccurredWithOpenAI]:
            HttpStatus.UnprocessableEntity,
        [ExceptionCode.QuizAnswerDoesNotExist]: HttpStatus.UnprocessableEntity,
        [ExceptionCode.QuizQuestionNotFound]: HttpStatus.NotFound,
        [ExceptionCode.QuizThemeNotFound]: HttpStatus.NotFound,
        [ExceptionCode.StillOnGoingQuizGame]: HttpStatus.Conflict,
        [ExceptionCode.UserAlreadyExists]: HttpStatus.Conflict,
        [ExceptionCode.UserNotFound]: HttpStatus.NotFound,
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
