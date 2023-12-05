import { QuizGame } from '../../domain/quiz-game';
import { QuizQuestion } from '../../domain/quiz-question';

export interface QuizGameRepository {
    createGame(userId: string, questions: QuizQuestion[]): QuizGame;
    deleteGame(gameId: string): void;
    updateGame(game: QuizGame): void;
}
