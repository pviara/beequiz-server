import { ApiService } from '../../../../open-ai/application/services/api/api-service';

export class ApiServiceSpy implements ApiService {
    calls = {
        cannotGenerateQuizQuestions: {
            count: 0,
        },
        cannotGenerateQuizThemes: {
            count: 0,
        },
        flagQuizQuestionRequest: {
            count: 0,
        },
        flagQuizThemeRequest: {
            count: 0,
        },
    };

    cannotGenerateQuizQuestions(): boolean {
        this.calls.cannotGenerateQuizQuestions.count++;
        return true;
    }

    cannotGenerateQuizThemes(): boolean {
        this.calls.cannotGenerateQuizThemes.count++;
        return true;
    }

    flagQuizQuestionRequest(): void {
        this.calls.flagQuizQuestionRequest.count++;
    }

    flagQuizThemeRequest(): void {
        this.calls.flagQuizThemeRequest.count++;
    }
}

export function stubCannotGenerateQuizQuestions(
    apiServiceSpy: ApiServiceSpy,
    returnedValue: boolean,
): void {
    apiServiceSpy.cannotGenerateQuizQuestions = () => {
        apiServiceSpy.calls.cannotGenerateQuizQuestions.count++;
        return returnedValue;
    };
}

export function stubCannotGenerateQuizThemes(
    apiServiceSpy: ApiServiceSpy,
    returnedValue: boolean,
): void {
    apiServiceSpy.cannotGenerateQuizThemes = () => {
        apiServiceSpy.calls.cannotGenerateQuizThemes.count++;
        return returnedValue;
    };
}
