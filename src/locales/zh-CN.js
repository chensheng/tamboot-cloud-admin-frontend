import exception from './zh-CN/exception';
import globalHeader from './zh-CN/globalHeader';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import settingDrawer from './zh-CN/settingDrawer';
import pwa from './zh-CN/pwa';
import userPassword from './zh-CN/userPassword';

export default {
  'app.name': 'TAMBOOT',
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  ...exception,
  ...globalHeader,
  ...login,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...userPassword,
};
