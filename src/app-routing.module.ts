import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { RouterModule, Routes } from '@nestjs/core';
import { UserModule } from './user/user.module';

const routes: Routes = [
    {
        path: 'api',
        children: [
            {
                path: 'auth',
                module: AuthModule,
            },
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
