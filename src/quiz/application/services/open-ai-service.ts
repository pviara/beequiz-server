import { QuizTheme } from 'src/quiz/domain/quiz-parameters';

export interface OpenAIService {
    generateThemesForQuiz(): QuizTheme[];
}
