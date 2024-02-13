import { QuizGame } from '../../domain/quiz-game';

export class CorrectAnswerGivenEvent {
    constructor(readonly gameId: QuizGame['id']) {}
}
