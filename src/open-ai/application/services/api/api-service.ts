export abstract class ApiService {
    abstract cannotGenerateQuizQuestions(): boolean;
    abstract cannotGenerateQuizThemes(): boolean;
    abstract flagQuizQuestionRequest(): void;
    abstract flagQuizThemeRequest(): void;
}
