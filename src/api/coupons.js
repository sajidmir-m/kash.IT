import { api } from './client'

export async function validateCoupon(code, cartTotal) {
  const { data } = await api.post('/api/coupons/validate', { code, cart_total: cartTotal })
  return data
}


