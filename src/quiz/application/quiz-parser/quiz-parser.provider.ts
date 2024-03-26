import { Provider } from '@nestjs/common';
import { QuizParser } from './quiz-parser';
import { QuizParserImpl } from './quiz-parser.impl';

export const QuizParserProvider: Provider = {
    provide: QuizParser,
    useClass: QuizParserImpl,
};
