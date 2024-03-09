import { OpenAIService } from './open-ai-service';
import { ParsedQuizQuestion } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-question';
import { ParsedQuizTheme } from '../../../../quiz/application/quiz-parser/model/parsed-quiz-theme';
import { QuizQuestion } from '../../../../quiz/domain/quiz-question';
import { QuizTheme } from '../../../../quiz/domain/quiz-parameters';

export class FakeOpenAIServiceImpl implements OpenAIService {
    generateQuestionsForQuiz(
        existingQuestions: QuizQuestion[],
        numberOfQuestions: number,
        themeLabel: string,
    ): Promise<ParsedQuizQuestion[]> {
        throw new Error('Method not implemented.');
    }
    generateThemesForQuiz(
        existingThemes: QuizTheme[],
    ): Promise<ParsedQuizTheme[]> {
        throw new Error('Method not implemented.');
    }
}
