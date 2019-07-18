import request from '@/utils/request';

export async function tree() {
  return request('/system-app/common/menu/tree');
}
