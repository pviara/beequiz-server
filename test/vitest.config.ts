import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
    test: {
        globals: true,
        root: './',
        reporters: ['verbose'],
    },
    plugins: [
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
});
