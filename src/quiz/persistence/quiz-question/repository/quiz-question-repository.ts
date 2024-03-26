import { ParsedQuizQuestion } from '../../../application/quiz-parser/model/parsed-quiz-question';
import { QuizQuestion } from '../../../domain/quiz-question';

export abstract class QuizQuestionRepository {
    abstract getQuizQuestion(questionId: string): Promise<QuizQuestion | null>;
    abstract getQuizQuestions(
        length: number,
        themeId: string,
    ): Promise<QuizQuestion[]>;
    abstract saveGeneratedQuestions(
        generatedQuestions: ParsedQuizQuestion[],
        themeId: string,
    ): Promise<QuizQuestion[]>;
}
