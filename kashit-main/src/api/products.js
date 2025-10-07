import { api } from './client'

export async function validateCoupon(code, cartTotal) {
  const { data } = await api.post('/api/coupons/validate', { code, cart_total: cartTotal })
  return data
}

import { api } from './client';

export async function fetchProductsByCategorySlug(categorySlug) {
  const { data } = await api.get(`/api/categories/${categorySlug}/products`);
  return data; // expected: array of products
}

export async function fetchCategories() {
  const { data } = await api.get('/api/categories');
  return data; // expected: array of categories
}


