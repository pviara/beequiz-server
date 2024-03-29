export const DATABASE_URI = 'DATABASE_URI';
export const TEST_DATABASE_URI = 'TEST_DATABASE_URI';
export const DEV_DATABASE_URI = 'DEV_DATABASE_URI';

export type DatabaseConfiguration = {
    [DATABASE_URI]: string;
    [TEST_DATABASE_URI]: string;
    [DEV_DATABASE_URI]: string;
};
