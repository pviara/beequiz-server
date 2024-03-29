import {
    ApiServiceImpl,
    QUIZ_QUESTIONS_REQUEST_INFO_PATH,
    QUIZ_THEMES_REQUEST_INFO_PATH,
    RequestInfo,
} from './api-service.impl';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DateTimeService } from '../../../../shared/date-time-service/datetime-service';
import { resolve } from 'path';
import * as fs from 'fs';

vi.mock('fs');
const fsMock = fs as jest.Mocked<typeof fs>;

describe('ApiServiceImpl', () => {
    let sut: ApiServiceImpl;
    let dateTimeServiceSpy: DateTimeServiceSpy;

    beforeEach(() => {
        dateTimeServiceSpy = new DateTimeServiceSpy();
        vi.resetAllMocks();

        sut = new ApiServiceImpl(dateTimeServiceSpy);
    });

    describe('cannotGenerateQuizQuestions', () => {
        it('should return true when last quiz question request was made LESS than 2 minutes ago', () => {
            const readRequestInfo: RequestInfo = {
                date: new Date('2023-12-05T10:23:00'),
            };
            const dummyDate = new Date('2023-12-05T10:24:00');

            stubReadFileSync(readRequestInfo);
            stubGetNow(dateTimeServiceSpy, dummyDate);

            const result = sut.cannotGenerateQuizQuestions();

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.readFileSync).toHaveBeenCalledWith(
                resolve(QUIZ_QUESTIONS_REQUEST_INFO_PATH),
            );

            expect(result).toBe(true);
        });

        it('should return false when last quiz question request was made MORE than 2 minutes ago', () => {
            const readRequestInfo: RequestInfo = {
                date: new Date('2023-12-05T10:23:00'),
            };
            const dummyDate = new Date('2023-12-05T10:25:12');

            stubReadFileSync(readRequestInfo);
            stubGetNow(dateTimeServiceSpy, dummyDate);

            const result = sut.cannotGenerateQuizQuestions();

            expect(result).toBe(false);
        });
    });

    describe('cannotGenerateQuizThemes', () => {
        it('should return true when last quiz theme request was made LESS than 2 minutes ago', () => {
            const readRequestInfo: RequestInfo = {
                date: new Date('2023-11-24T21:58:00'),
            };
            const dummyDate = new Date('2023-11-24T21:59:00');

            stubReadFileSync(readRequestInfo);
            stubGetNow(dateTimeServiceSpy, dummyDate);

            const result = sut.cannotGenerateQuizThemes();

            expect(fsMock.readFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.readFileSync).toHaveBeenCalledWith(
                resolve(QUIZ_THEMES_REQUEST_INFO_PATH),
            );

            expect(result).toBe(true);
        });

        it('should return false when last quiz theme request was made MORE than 2 minutes ago', () => {
            const readRequestInfo: RequestInfo = {
                date: new Date('2023-11-24T21:58:00'),
            };
            const dummyDate = new Date('2023-11-24T22:37:00');

            stubReadFileSync(readRequestInfo);
            stubGetNow(dateTimeServiceSpy, dummyDate);

            const result = sut.cannotGenerateQuizThemes();

            expect(result).toBe(false);
        });
    });

    describe('flagQuizQuestionSRequest', () => {
        it("should write a JSON file at a specific path with today's date in it", () => {
            const dummyDate = new Date('2023-11-25');
            const requestInfoToWrite: RequestInfo = {
                date: dummyDate,
            };

            stubGetNow(dateTimeServiceSpy, dummyDate);

            sut.flagQuizQuestionRequest();

            expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                resolve(QUIZ_QUESTIONS_REQUEST_INFO_PATH),
                JSON.stringify(requestInfoToWrite),
            );
        });
    });

    describe('flagQuizThemeRequest', () => {
        it("should write a JSON file at a specific path with today's date in it", () => {
            const dummyDate = new Date('2023-11-25');
            const requestInfoToWrite: RequestInfo = {
                date: dummyDate,
            };

            stubGetNow(dateTimeServiceSpy, dummyDate);

            sut.flagQuizThemeRequest();

            expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
            expect(fsMock.writeFileSync).toHaveBeenCalledWith(
                resolve(QUIZ_THEMES_REQUEST_INFO_PATH),
                JSON.stringify(requestInfoToWrite),
            );
        });
    });
});

class DateTimeServiceSpy implements DateTimeService {
    calls = {
        getNow: {
            count: 0,
        },
    };

    getNow(): Date {
        this.calls.getNow.count++;
        return new Date('1900-01-01');
    }
}

function stubReadFileSync(requestInfo: RequestInfo): void {
    fsMock.readFileSync.mockReturnValue(JSON.stringify(requestInfo));
}

function stubGetNow(
    dateTimeServiceSpy: DateTimeServiceSpy,
    returnedValue: Date,
): void {
    dateTimeServiceSpy.getNow = (): Date => {
        dateTimeServiceSpy.calls.getNow.count++;
        return returnedValue;
    };
}
