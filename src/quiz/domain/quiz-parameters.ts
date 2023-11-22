export class QuizTheme {
    constructor(
        readonly code: string,
        readonly label: string,
    ) {}
}

export class QuizParameters {
    constructor(
        readonly themes: QuizTheme[],
        readonly numberOfQuestions: number[],
    ) {}

    shuffleThemes(): void {
        for (let i = this.themes.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [this.themes[i], this.themes[randomIndex]] = [
                this.themes[randomIndex],
                this.themes[i],
            ];
        }
    }
}
