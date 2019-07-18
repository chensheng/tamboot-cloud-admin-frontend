import exception from './en-US/exception';
import globalHeader from './en-US/globalHeader';
import login from './en-US/login';
import menu from './en-US/menu';
import settingDrawer from './en-US/settingDrawer';
import pwa from './en-US/pwa';
import userPassword from './en-US/userPassword';

export default {
  'app.name': 'TAMBOOT',
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'introduce',
  ...exception,
  ...globalHeader,
  ...login,
  ...menu,
  ...settingDrawer,
  ...pwa,
  ...userPassword,
};
