import { BusinessCode } from '@/utils/constants';
import { mockDelay } from '@/utils/utils';

const proxy = {
  'GET /api/system-app/common/menu/tree': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
      data: [
        {
          id: '6533916193823133696',
          path: '/system',
          locale: null,
          name: '系统配置',
          icon: 'setting',
          orderIndex: 0,
          parent: null,
          children: [
            {
              id: '6536612123282247681',
              path: '/system/user',
              locale: null,
              name: '用户管理',
              icon: null,
              orderIndex: 1,
              parent: '6533916193823133696',
              children: [],
            },
            {
              id: '6533916677858398211',
              path: '/system/menu',
              locale: null,
              name: '菜单管理',
              icon: null,
              orderIndex: 2,
              parent: '6533916193823133696',
              children: [],
            },
            {
              id: '6533916797031157764',
              path: '/system/role',
              locale: null,
              name: '角色管理',
              icon: null,
              orderIndex: 3,
              parent: '6533916193823133696',
              children: [],
            },
            {
              id: '6536608913624666112',
              path: '/system/permission',
              locale: null,
              name: '访问权限',
              icon: null,
              orderIndex: 4,
              parent: '6533916193823133696',
              children: [],
            },
          ],
        },
        {
          id: '6533917218659373061',
          path: '/user',
          locale: null,
          name: '用户中心',
          icon: 'hdd',
          orderIndex: 2,
          parent: null,
          children: [
            {
              id: '6533917345537069062',
              path: '/user/password',
              locale: null,
              name: '修改密码',
              icon: null,
              orderIndex: 0,
              parent: '6533917218659373061',
              children: [],
            },
          ],
        },
      ],
    });
  },
};

export default mockDelay(proxy);
