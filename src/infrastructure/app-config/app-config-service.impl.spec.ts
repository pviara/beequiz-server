import { AppConfigServiceImpl } from './app-config-service.impl';
import { ConfigService } from '@nestjs/config';
import { DATABASE_URI } from './configuration/database-configuration';
import { OPENAI_API_KEY } from './configuration/openai-configuration';

describe('AppConfigServiceImpl', () => {
    let sut: AppConfigServiceImpl;
    let configServiceSpy: ConfigServiceSpy;

    beforeEach(() => {
        configServiceSpy = new ConfigServiceSpy();
        sut = new AppConfigServiceImpl(configServiceSpy);
    });

    describe('getDatabaseConfig', () => {
        it("should throw an error when database URI couldn't be found", () => {
            const returnedValue = undefined as unknown as string;
            stubConfigServiceGet(configServiceSpy, returnedValue);

            expect(() => sut.getDatabaseConfig()).toThrow();
        });

        it('should get database URI using NestJS ConfigService', () => {
            const returnedValue = 'database_uri_fake_key';
            stubConfigServiceGet(configServiceSpy, returnedValue);

            const result = sut.getDatabaseConfig();

            expect(configServiceSpy.callCountToGet).toBe(1);
            expect(configServiceSpy.callHistoryToGet).toContain(DATABASE_URI);
            expect(result).toHaveProperty(DATABASE_URI);
        });
    });

    describe('getOpenAIConfig', () => {
        it("should throw an error when OpenAI API key couldn't be found", () => {
            const returnedValue = undefined as unknown as string;
            stubConfigServiceGet(configServiceSpy, returnedValue);

            expect(() => sut.getOpenAIConfig()).toThrow();
        });

        it('should get OpenAI API key using NestJS ConfigService', () => {
            const returnedValue = 'openai_api_fake_key';
            stubConfigServiceGet(configServiceSpy, returnedValue);

            const result = sut.getOpenAIConfig();

            expect(configServiceSpy.callCountToGet).toBe(1);
            expect(configServiceSpy.callHistoryToGet).toContain(OPENAI_API_KEY);
            expect(result).toHaveProperty(OPENAI_API_KEY);
        });
    });
});

class ConfigServiceSpy extends ConfigService {
    callCountToGet = 0;
    callHistoryToGet: string[] = [];

    override get(key: string): string {
        this.callCountToGet++;
        this.callHistoryToGet.push(key);
        return '';
    }
}

function stubConfigServiceGet(
    configServiceSpy: ConfigServiceSpy,
    returnedValue: string,
): void {
    configServiceSpy.get = (key: string): string => {
        configServiceSpy.callCountToGet++;
        configServiceSpy.callHistoryToGet.push(key);
        return returnedValue;
    };
}
