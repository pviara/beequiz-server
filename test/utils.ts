import { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';

export async function createApplicationFrom(
    module: Type<any>,
): Promise<INestApplication> {
    const moduleBuilder = Test.createTestingModule({
        imports: [module],
    });

    const moduleRef = await moduleBuilder.compile();
    return moduleRef.createNestApplication();
}
