import { QuizQuestion } from '../domain/quiz-question';

export interface QuizQuestionRepository {
    getQuizQuestions(themeId: string): QuizQuestion[];
    saveGeneratedQuestions(quizQuestions: QuizQuestion[]): void;
}
