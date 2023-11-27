export type OpenAIResponse = {
    id: string;
    choices: [
        {
            message: {
                role: 'assistant';
                content: string;
            };
        },
    ];
};
