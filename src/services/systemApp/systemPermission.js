import request from '@/utils/request';

export async function page(body) {
  return request('/system-app/system/permission/page', { body });
}

export async function create(body) {
  return request('/system-app/system/permission/create', { method: 'POST', body });
}

export async function update(body) {
  return request('/system-app/system/permission/update', { method: 'POST', body });
}

export async function refresh() {
  return request('/system-app/system/permission/refresh', { method: 'POST' });
}

export async function del(id) {
  return request(`/system-app/system/permission/delete/${id}`, { method: 'POST' });
}
