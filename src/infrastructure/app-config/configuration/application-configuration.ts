export const ALLOWED_ORIGIN = 'ALLOWED_ORIGIN';
export const APP_ENVIRONMENT = 'APP_ENVIRONMENT';
export const APP_PORT = 'APP_PORT';

export enum AppEnvironment {
    Development = 'dev',
    Production = 'prod',
}

export type ApplicationConfiguration = {
    [ALLOWED_ORIGIN]: string;
    [APP_ENVIRONMENT]: AppEnvironment;
    [APP_PORT]: string;
};
