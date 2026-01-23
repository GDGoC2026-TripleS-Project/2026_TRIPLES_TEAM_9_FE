import api from './axios';

export const getMe = () => api.get('/api/user/info');
export const updateMe = (data) => api.patch('/api/user/info', data);