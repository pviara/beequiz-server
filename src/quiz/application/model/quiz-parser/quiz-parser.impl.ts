import { QuizParser } from './quiz-parser';
import { QuizQuestion } from '../../../domain/quiz-question';
import { QuizQuestionsParser } from './quiz-questions-parser/quiz-questions-parser';
import { QuizTheme } from '../../../domain/quiz-parameters';
import { QuizThemesParser } from './quiz-themes-parser/quiz-themes-parser';

export class QuizParserImpl implements QuizParser {
    parseQuizQuestions(stringifiedObject: string): QuizQuestion[] {
        return new QuizQuestionsParser(stringifiedObject).parse();
    }

    parseQuizThemes(stringifiedObject: string): QuizTheme[] {
        return new QuizThemesParser(stringifiedObject).parse();
    }
}
