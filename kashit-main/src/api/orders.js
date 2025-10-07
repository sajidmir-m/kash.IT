import { api } from './client'

export async function listOrders() {
  const { data } = await api.get('/api/orders/')
  return data?.orders || []
}

export async function getOrder(orderId) {
  const { data } = await api.get(`/api/orders/${orderId}`)
  return data
}

export async function createOrder(payload) {
  const { data } = await api.post('/api/orders/', payload)
  return data
}


