export const JWT_SECRET = 'JWT_SECRET';
export const OAUTH_CLIENT = 'OAUTH_CLIENT';
export const OAUTH_REDIRECT_URL = 'OAUTH_REDIRECT_URL';
export const OAUTH_SECRET = 'OAUTH_SECRET';

export type AuthenticationConfiguration = {
    [JWT_SECRET]: string;
    [OAUTH_CLIENT]: string;
    [OAUTH_REDIRECT_URL]: string;
    [OAUTH_SECRET]: string;
};
