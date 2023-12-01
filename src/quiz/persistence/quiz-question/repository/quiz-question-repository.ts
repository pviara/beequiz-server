import { ParsedQuizQuestion } from '../../../application/quiz-parser/model/parsed-quiz-question';
import { QuizQuestion } from '../../../domain/quiz-question';

export interface QuizQuestionRepository {
    getQuizQuestion(questionId: string): Promise<QuizQuestion | null>;
    getQuizQuestions(length: number, themeId: string): Promise<QuizQuestion[]>;
    saveGeneratedQuestions(
        generatedQuestions: ParsedQuizQuestion[],
        themeId: string,
    ): Promise<QuizQuestion[]>;
}
