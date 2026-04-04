import { api } from './api';

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: 'user' | 'admin';
    }
}

export async function login(payload: LoginPayload) : Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
}