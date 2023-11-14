import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [];

@Module({
    exports: [RouterModule],
    imports: [RouterModule.register(routes)],
})
export class AppRoutingModule {}
