import { AuthenticatedRequest } from '../../auth/presentation/model/authenticated-request';
import { CommandBus } from '@nestjs/cqrs';
import { Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth-guard';
import { WelcomeUserCommand } from '../application/handlers/welcome-user.handler';

@Controller()
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @UseGuards(JwtAuthGuard)
    @Patch('welcome')
    async welcomeUser(@Request() req: AuthenticatedRequest): Promise<void> {
        const command = new WelcomeUserCommand(req.user.id);
        await this.commandBus.execute(command);
    }
}
