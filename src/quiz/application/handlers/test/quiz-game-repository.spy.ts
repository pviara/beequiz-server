import { QuizGame } from '../../../domain/quiz-game';
import { QuizGameRepository } from '../../../persistence/quiz-game/repository/quiz-game-repository';

export class QuizGameRepositorySpy implements QuizGameRepository {
    calls = {
        createGame: {
            count: 0,
            history: [] as [string, string[]][],
        },
        deleteGame: {
            count: 0,
            history: [] as string[],
        },
        getOnGoingGame: {
            count: 0,
            history: [] as string[],
        },
        increaseGameScore: {
            count: 0,
            history: [] as string[],
        },
    };

    async createGame(userId: string, questionIds: string[]): Promise<void> {
        this.calls.createGame.count++;
        this.calls.createGame.history.push([userId, questionIds]);
    }

    async deleteGame(gameId: string): Promise<void> {
        this.calls.deleteGame.count++;
        this.calls.deleteGame.history.push(gameId);
    }

    async getOnGoingGame(userId: string): Promise<QuizGame | null> {
        this.calls.getOnGoingGame.count++;
        this.calls.getOnGoingGame.history.push(userId);
        return null;
    }

    async increaseGameScore(gameId: string): Promise<void> {
        this.calls.increaseGameScore.count++;
        this.calls.increaseGameScore.history.push(gameId);
    }
}

export function stubGetOnGoingGame(
    quizGameRepoSpy: QuizGameRepositorySpy,
    returnedValue: QuizGame | null,
): void {
    quizGameRepoSpy.getOnGoingGame = (
        userId: string,
    ): Promise<QuizGame | null> => {
        quizGameRepoSpy.calls.getOnGoingGame.count++;
        quizGameRepoSpy.calls.getOnGoingGame.history.push(userId);
        return Promise.resolve(returnedValue);
    };
}
