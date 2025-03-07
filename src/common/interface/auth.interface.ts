export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    userAgent?: string;
}

export interface LoginDto {
    name: string;
    email: string;
    userAgent?: string;
}