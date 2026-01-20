import apiClient from './client';

export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    lastLogin?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);

    // Save token and user to localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
};

/**
 * Login with email and password
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);

    // Save token and user to localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.data.user;
};

/**
 * Logout (clear local storage)
 */
export const logout = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};
