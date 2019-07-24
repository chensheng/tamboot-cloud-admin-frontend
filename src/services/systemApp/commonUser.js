import request from '@/utils/request';

export async function details() {
  return request('/system-app/common/user/details');
}

export async function refreshToken() {
  return request('/system-app/common/user/refreshToken', {ignoreDefaultFailHandler: true});
}

export async function updatePassword(body) {
  return request('/system-app/common/user/updatePassword', { method: 'POST', body });
}
