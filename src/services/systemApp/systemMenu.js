import request from '@/utils/request';

export async function tree() {
  return request('/system-app/system/menu/tree');
}

export async function roleMenus(roleId) {
  return request(`/system-app/system/menu/roleMenus?roleId=${roleId}`);
}

export async function update(body) {
  return request('/system-app/system/menu/update', { method: 'POST', body });
}

export async function create(body) {
  return request('/system-app/system/menu/create', { method: 'POST', body });
}

export async function del(menuId) {
  return request(`/system-app/system/menu/delete/${menuId}`, { method: 'POST' });
}
