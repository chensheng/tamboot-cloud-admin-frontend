import { BusinessCode } from '@/utils/constants';
import { mockDelay } from '@/utils/utils';

const proxy = {
  'POST /api/system-app/login': (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123456') {
      res.json({
        code: BusinessCode.SUCCESS,
        msg: 'success',
      });
      return;
    }

    if (username === 'user' && password === 'user123456') {
      res.json({
        code: BusinessCode.SUCCESS,
        msg: 'success',
      });
      return;
    }

    res.json({
      code: BusinessCode.FAIL,
      msg: '用户名或密码错误',
    });
  },
};

export default mockDelay(proxy);
