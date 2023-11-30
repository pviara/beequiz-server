import { ApiService } from './api-service';
import { DateTimeService } from '../../../../shared/data-time-service/datetime-service';
import { DATE_TIME_SERVICE_TOKEN } from '../../../../shared/data-time-service/date-time-service.provider';
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
        const requestInfo = this.retrieveQuestionRequestInfo();
        if (!requestInfo) {
            return false;
        }

        if (this.isDateIsLessThan3DaysAgo(requestInfo.date)) {
            return true;
        }

        return false;
    }

    cannotGenerateQuizThemes(): boolean {
        const requestInfo = this.retrieveThemeRequestInfo();
        if (!requestInfo) {
            return false;
        }

        if (this.isDateIsLessThan3DaysAgo(requestInfo.date)) {
            return true;
        }

        return false;
    }

    flagQuizQuestionRequest(): void {
        const requestInfo: RequestInfo = {
            date: this.dateTimeService.getNow(),
        };

        writeFileSync(
            resolve(QUIZ_QUESTIONS_REQUEST_INFO_PATH),
            JSON.stringify(requestInfo),
        );
    }

    flagQuizThemeRequest(): void {
        const requestInfo: RequestInfo = {
            date: this.dateTimeService.getNow(),
        };

        writeFileSync(
            resolve(QUIZ_THEMES_REQUEST_INFO_PATH),
            JSON.stringify(requestInfo),
        );
    }

    private isDateIsLessThan3DaysAgo(date: Date): boolean {
        const currentDate = this.dateTimeService.getNow();
        const timeDifference = currentDate.getTime() - date.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        return hoursDifference < 72;
    }

    private retrieveQuestionRequestInfo(): RequestInfo | null {
        const requestInfo = JSON.parse(
            readFileSync(resolve(QUIZ_QUESTIONS_REQUEST_INFO_PATH)).toString(),
        );
        if (!requestInfo?.date) {
            return null;
        }

        return {
            date: new Date(requestInfo.date),
        };
    }

    private retrieveThemeRequestInfo(): RequestInfo | null {
        const requestInfo = JSON.parse(
            readFileSync(resolve(QUIZ_THEMES_REQUEST_INFO_PATH)).toString(),
        );
        if (!requestInfo?.date) {
            return null;
        }

        return {
            date: new Date(requestInfo.date),
        };
    }
}
