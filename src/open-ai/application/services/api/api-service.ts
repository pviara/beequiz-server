export interface ApiService {
    cannotGenerateQuizQuestions(): boolean;
    cannotGenerateQuizThemes(): boolean;
    flagQuizQuestionRequest(): void;
    flagQuizThemeRequest(): void;
}
