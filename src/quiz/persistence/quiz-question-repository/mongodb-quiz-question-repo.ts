import { Injectable } from '@nestjs/common';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizQuestionRepository } from './quiz-question-repository';

@Injectable()
export class MongoDbQuizQuestionRepo implements QuizQuestionRepository {
    getQuizQuestions(themeId: string): QuizQuestion[] {
        throw new Error('Method not implemented.');
    }

    saveGeneratedQuestions(quizQuestions: QuizQuestion[]): void {
        throw new Error('Method not implemented.');
    }
}
