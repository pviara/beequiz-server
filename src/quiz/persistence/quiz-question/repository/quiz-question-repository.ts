import { ParsedQuizQuestion } from '../../../application/quiz-parser/model/parsed-quiz-question';
import { QuizQuestion } from '../../../domain/quiz-question';

export interface QuizQuestionRepository {
    getQuizQuestions(themeId: string): Promise<QuizQuestion[]>;
    saveGeneratedQuestions(
        quizQuestions: ParsedQuizQuestion[],
    ): Promise<QuizQuestion[]>;
}
