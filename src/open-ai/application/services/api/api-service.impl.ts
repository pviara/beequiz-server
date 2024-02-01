import { ApiService } from './api-service';
import { DateTimeService } from '../../../../shared/date-time-service/datetime-service';
import { DATE_TIME_SERVICE_TOKEN } from '../../../../shared/date-time-service/date-time-service.provider';
import { Inject } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export type RequestInfo = {
    date: Date;
};

export const QUIZ_QUESTIONS_REQUEST_INFO_PATH =
    'src/open-ai/application/services/api/last-quiz-question-request-date.json';

export const QUIZ_THEMES_REQUEST_INFO_PATH =
    'src/open-ai/application/services/api/last-quiz-theme-request-date.json';

export class ApiServiceImpl implements ApiService {
    constructor(
        @Inject(DATE_TIME_SERVICE_TOKEN)
        private dateTimeService: DateTimeService,
    ) {}

    cannotGenerateQuizQuestions(): boolean {
        const requestInfo = this.retrieveRequestInfo('questions');
        return this.isDateIsLessThanTwoMinutesAgo(requestInfo.date);
    }

    cannotGenerateQuizThemes(): boolean {
        const requestInfo = this.retrieveRequestInfo('themes');
        return this.isDateIsLessThanTwoMinutesAgo(requestInfo.date);
    }

    flagQuizQuestionRequest(): void {
        this.flagRequest('questions');
    }

    flagQuizThemeRequest(): void {
        this.flagRequest('themes');
    }

    private retrieveRequestInfo(type: 'questions' | 'themes'): RequestInfo {
        const path = this.getFilePathFor(type);

        const existingRequestInfo = JSON.parse(
            readFileSync(resolve(path)).toString(),
        );
        const noDateInRequestInfo = !existingRequestInfo?.date;

        if (noDateInRequestInfo) {
            return {
                date: this.dateTimeService.getNow(),
            };
        }

        return {
            date: new Date(existingRequestInfo.date),
        };
    }

    private getFilePathFor(type: 'questions' | 'themes'): string {
        return type === 'questions'
            ? QUIZ_QUESTIONS_REQUEST_INFO_PATH
            : QUIZ_THEMES_REQUEST_INFO_PATH;
    }

    private isDateIsLessThanTwoMinutesAgo(date: Date): boolean {
        const currentDate = this.dateTimeService.getNow();
        const timeDifference = currentDate.getTime() - date.getTime();
        const passedMinutes = timeDifference / (1000 * 60);

        return passedMinutes < 2;
    }

    private flagRequest(type: 'questions' | 'themes'): void {
        const requestInfo: RequestInfo = {
            date: this.dateTimeService.getNow(),
        };

        const path = this.getFilePathFor(type);

        writeFileSync(resolve(path), JSON.stringify(requestInfo));
    }
}
