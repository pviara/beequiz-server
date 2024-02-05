import { Exception } from '../../../application/exception';

export class QuizThemeNotFoundException extends Exception {
    readonly message: string;

    constructor(themeId: string) {
        super('QuizThemeNotFound');
        this.message = this.formatMessage(themeId);
    }

    private formatMessage(themeId: string): string {
        return `No quiz theme was found with given id "${themeId}".`;
    }
}
