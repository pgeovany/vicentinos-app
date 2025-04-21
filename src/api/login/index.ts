import { api } from '../axios-instance';
import { ApiResponse } from '../types';
import { LoginDto } from './schemas';
import { LoginResponse } from './types';

export const loginApi = {
  login: async (body: LoginDto) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', body);

    return data;
  },
};
