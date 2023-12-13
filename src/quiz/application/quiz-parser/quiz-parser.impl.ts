import { ParsedQuizQuestion } from './model/parsed-quiz-question';
import { ParsedQuizTheme } from './model/parsed-quiz-theme';
import { QuizParser } from './quiz-parser';
import { QuizQuestionsParser } from './quiz-questions-parser/quiz-questions-parser';
import { QuizThemesParser } from './quiz-themes-parser/quiz-themes-parser';

export class QuizParserImpl implements QuizParser {
    parseQuizQuestions(stringifiedObject: string): ParsedQuizQuestion[] {
        return new QuizQuestionsParser(stringifiedObject).parse();
    }

    parseQuizThemes(stringifiedObject: string): ParsedQuizTheme[] {
        return new QuizThemesParser(stringifiedObject).parse();
    }
}
