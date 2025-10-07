import { api } from './client';

export async function registerUser({ email, password, full_name, phone }) {
  const { data } = await api.post('/api/auth/register', { email, password, full_name, phone });
  return data; // { message, user_id }
}

export async function verifyOtp({ email, otp }) {
  const { data } = await api.post('/api/auth/verify-otp', { email, otp });
  return data; // { message }
}

export async function loginUser({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data; // { access_token, refresh_token, user }
}

export async function getProfile(token) {
  const { data } = await api.get('/api/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function resendOtp({ email }) {
  const { data } = await api.post('/api/auth/resend-otp', { email });
  return data; // { message }
}

export async function forgotPassword({ email }) {
  const { data } = await api.post('/api/auth/forgot-password', { email });
  return data; // { message }
}

export async function resetPassword({ email, otp, new_password }) {
  const { data } = await api.post('/api/auth/reset-password', { email, otp, new_password });
  return data; // { message }
}

export async function deleteAccount() {
  const { data } = await api.delete('/api/auth/delete-account');
  return data;
}


