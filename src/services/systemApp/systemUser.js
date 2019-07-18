import request from '@/utils/request';

export async function page(query) {
  return request('/system-app/system/user/page', { body: query });
}

export async function create(body) {
  return request('/system-app/system/user/create', { method: 'POST', body });
}

export async function enable(userId) {
  return request(`/system-app/system/user/enable/${userId}`, { method: 'POST' });
}

export async function disable(userId) {
  return request(`/system-app/system/user/disable/${userId}`, { method: 'POST' });
}

export async function resetPassword(body) {
  return request('/system-app/system/user/resetPassword', { method: 'POST', body });
}

export async function assignRoles(body) {
  return request('/system-app/system/user/assignRoles', { method: 'POST', body });
}
