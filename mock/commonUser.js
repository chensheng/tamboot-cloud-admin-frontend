import { BusinessCode } from '@/utils/constants';
import { mockDelay } from '@/utils/utils';

const proxy = {
  'GET /api/system-app/common/user/details': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
      data: {
        userId: '1',
        username: 'admin',
      },
    });
  },

  'GET /api/system-app/common/user/refreshToken': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success'
    });
  }

  'POST /api/system-app/common/user/updatePassword': (req, res) => {
    res.json({
      code: BusinessCode.SUCCESS,
      msg: 'success',
    });
  },
};

export default mockDelay(proxy);
