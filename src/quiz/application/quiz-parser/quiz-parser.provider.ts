import { Provider } from '@nestjs/common';
import { QuizParserImpl } from './quiz-parser.impl';

export const QUIZ_PARSER_TOKEN = 'QuizParser';

export const QuizParserProvider: Provider = {
    provide: QUIZ_PARSER_TOKEN,
    useClass: QuizParserImpl,
};
