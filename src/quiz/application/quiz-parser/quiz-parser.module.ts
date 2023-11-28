import { Module } from '@nestjs/common';
import { QuizParserProvider } from './quiz-parser.provider';

@Module({
    exports: [QuizParserProvider],
    providers: [QuizParserProvider],
})
export class QuizParserModule {}
