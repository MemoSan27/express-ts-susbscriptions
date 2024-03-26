//Interface about login data
export interface AuthService {
    login(email: string, password: string): Promise<string | null>;
}

