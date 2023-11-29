import { QuizParser } from './quiz-parser';
import { QuizQuestion } from '../../domain/quiz-question';
import { QuizQuestionsParser } from './quiz-questions-parser/quiz-questions-parser';
import { QuizTheme } from '../../domain/quiz-parameters';
import { QuizThemesParser } from './quiz-themes-parser/quiz-themes-parser';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';

export class QuizParserImpl implements QuizParser {
    parseQuizQuestions(stringifiedObject: string): QuizQuestion[] {
        return new QuizQuestionsParser(stringifiedObject).parse();
    }

    parseQuizThemes(stringifiedObject: string): ParsedQuizTheme[] {
        return new QuizThemesParser(stringifiedObject).parse();
    }
}
