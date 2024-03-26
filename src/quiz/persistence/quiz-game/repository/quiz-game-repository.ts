import { QuizGame } from '../../../domain/quiz-game';

export abstract class QuizGameRepository {
    abstract getOnGoingGame(userId: string): Promise<QuizGame | null>;
    abstract createGame(userId: string, questionIds: string[]): Promise<void>;
    abstract deleteGame(gameId: string): Promise<void>;
    abstract increaseGameScore(gameId: string): Promise<void>;
}
