import { DateTimeService } from './datetime-service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateTimeServiceImpl implements DateTimeService {
    getNow(): Date {
        return new Date();
    }
}
