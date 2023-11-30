import { DateTimeService } from '../../../../shared/data-time-service/datetime-service';
import { ApiService } from './api-service';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export type RequestInfo = {
    date: Date;
};

export const QUIZ_THEMES_REQUEST_INFO_PATH =
    'src/open-ai/application/services/api/last-quiz-theme-request-date.json';

export class ApiServiceImpl implements ApiService {
    constructor(private dateTimeService: DateTimeService) {}

    cannotGenerateQuizThemes(): boolean {
        const requestInfo = this.retrieveRequestInfo();
        if (!requestInfo) {
            return false;
        }

        if (this.isDateIsLessThan3DaysAgo(requestInfo.date)) {
            return true;
        }

        return false;
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

    private retrieveRequestInfo(): RequestInfo | null {
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
