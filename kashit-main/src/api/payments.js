import { api } from './client';

export async function getRazorpayKey() {
  const { data } = await api.get('/api/payments/key');
  return data.key;
}

export async function createRazorpayOrder({ amount, currency = 'INR', receipt }) {
  const { data } = await api.post('/api/payments/create-order', { amount, currency, receipt });
  return data;
}


