import { isParsedStringNaN } from './utils';

describe('isParsedStringNaN', () => {
    it('should return true for all given strings', () => {
        const strings: string[] = ['test', 'a', 'eeeee', 'x', '', ' '];
        strings.every((string) => expect(isParsedStringNaN(string)).toBe(true));
    });

    it('should return false for all given strings', () => {
        const strings: string[] = ['1', '1e10', '364', '-5', '0'];
        strings.every((string) =>
            expect(isParsedStringNaN(string)).toBe(false),
        );
    });
});
