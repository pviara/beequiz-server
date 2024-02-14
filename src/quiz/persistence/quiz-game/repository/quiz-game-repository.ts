import { QuizGame } from '../../../domain/quiz-game';

export interface QuizGameRepository {
    getOnGoingGame(userId: string): Promise<QuizGame | null>;
    createGame(userId: string, questionIds: string[]): Promise<void>;
    deleteGame(gameId: string): Promise<void>;
    increaseGameScore(gameId: string): Promise<void>;
}
