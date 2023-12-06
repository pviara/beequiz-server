import { AddUserDTO } from './dto/add-user.dto';
import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddUserCommand } from '../application/handlers/add-user.handler';
import { AddUserDTOInterceptor } from './interceptors/add-user-dto-interceptor';

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
}
