import { Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth-guard';
import { Request as ExpressRequest } from 'express';
import { User } from '../domain/user';
import { WelcomeUserCommand } from '../application/handlers/welcome-user.handler';

@Controller()
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @UseGuards(JwtAuthGuard)
    @Patch('welcome')
    async welcomeUser(
        @Request() req: ExpressRequest & { user: User },
    ): Promise<void> {
        const command = new WelcomeUserCommand(req.user.id);
        await this.commandBus.execute(command);
    }
}
