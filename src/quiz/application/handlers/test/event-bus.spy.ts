import { CommandBus, EventBus, UnhandledExceptionBus } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';

export class EventBusSpy extends EventBus {
    calls = {
        publish: {
            count: 0,
            history: [] as any[],
        },
    };

    constructor() {
        super({} as CommandBus, {} as ModuleRef, {} as UnhandledExceptionBus);
    }

    override publish(event: any): void {
        this.calls.publish.count++;
        this.calls.publish.history.push(event);
    }
}
