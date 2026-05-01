export interface LoginRequest {
    username: string;
    password?: string; // Optional if only SSO is used, but usually present
}

export interface LoginResponse {
    jwt: string;
    role?: string;
}
