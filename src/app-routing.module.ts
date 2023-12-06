import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';

const routes: Routes = [
    {
        path: 'api',
        children: [
            {
                path: 'quiz',
                module: QuizModule,
            },
            {
                path: 'user',
                module: UserModule,
            },
        ],
    },
];

@Module({
    exports: [RouterModule],
    imports: [RouterModule.register(routes)],
})
export class AppRoutingModule {}
