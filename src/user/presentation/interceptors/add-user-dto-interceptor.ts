import { AddUserDTO } from '../dto/add-user.dto';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AddUserDTOInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<AddUserDTO> {
        const request = context.switchToHttp().getRequest();

        const dto = plainToInstance(AddUserDTO, {
            ...request.body,
        });
        request.body = dto;

        return next.handle().pipe<AddUserDTO>(map((data) => data));
    }
}
