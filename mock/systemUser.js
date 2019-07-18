import { BusinessCode } from '@/utils/constants';
import { mockDelay } from '@/utils/utils';

const proxy = {
  'GET /api/system-app/system/user/page': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
      data: {
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        total: 2,
        result: [
          {
            id: '1',
            username: 'admin',
            status: 1,
            roleCodes: 'MANAGER',
            roleNames: '管理员',
            roleCodeList: ['MANAGER'],
            roleNameList: ['管理员'],
          },
          {
            id: '2',
            username: 'sheng.chen',
            status: 0,
            roleCodes: 'USER',
            roleNames: '用户',
            roleCodeList: ['USER'],
            roleNameList: ['用户'],
          },
        ],
      },
    });
  },

  'POST /api/system-app/system/user/create': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },

  'POST /api/system-app/system/user/enable/:id': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },

  'POST /api/system-app/system/user/disable/:id': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },

  'POST /api/system-app/system/user/resetPassword': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },

  'POST /api/system-app/system/user/assignRoles': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },
};

export default mockDelay(proxy);
