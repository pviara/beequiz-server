import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParsedQuizQuestion } from '../../../application/quiz-parser/model/parsed-quiz-question';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionRepository } from './quiz-question-repository';
import {
    QUIZ_QUESTION_MODEL,
    QuizQuestionEntity,
} from '../entity/quiz-question-entity';

@Injectable()
export class MongoDbQuizQuestionRepo implements QuizQuestionRepository {
    constructor(
        @InjectModel(QUIZ_QUESTION_MODEL)
        private model: Model<QuizQuestionEntity>,
    ) {}

    getQuizQuestions(themeId: string): Promise<QuizQuestion[]> {
        throw new Error('Method not implemented.');
    }

    saveGeneratedQuestions(
        quizQuestions: ParsedQuizQuestion[],
    ): Promise<QuizQuestion[]> {
        throw new Error('Method not implemented.');
    }
}
