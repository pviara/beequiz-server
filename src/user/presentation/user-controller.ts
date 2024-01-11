import { AddUserCommand } from '../application/handlers/add-user.handler';
import { AddUserDTO } from './dto/add-user.dto';
import { AddUserDTOInterceptor } from './interceptors/add-user-dto-interceptor';
import {
    BadRequestException,
    Body,
    Controller,
    Patch,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth-guard';
import { Request as ExpressRequest } from 'express';
import { User } from '../domain/user';
import { WelcomeUserCommand } from '../application/handlers/welcome-user.handler';

@Controller()
export class UserController {
    constructor(private commandBus: CommandBus) {}

    @Post()
    @UseInterceptors(AddUserDTOInterceptor)
    async addUser(@Body() dto: AddUserDTO): Promise<void> {
        if (dto.isUsernameInvalid()) {
            throw new BadRequestException(
                'Username cannot be empty or whitespaced.',
            );
        }

        if (dto.isPasswordInvalid()) {
            throw new BadRequestException(
                'Username cannot be empty or whitespaced.',
            );
        }

        const { username, password } = dto.extractPayload();
        const command = new AddUserCommand(username, password);

        await this.commandBus.execute(command);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('welcome')
    async welcomeUser(
        @Request() req: ExpressRequest & { user: User },
    ): Promise<void> {
        const command = new WelcomeUserCommand(req.user.id);
        await this.commandBus.execute(command);
    }
}
