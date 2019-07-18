import {
  stateOfPage,
  effectsOfPage,
  reducersOfPage,
  effectsWithCallback,
} from '@/utils/ModelTemplate';
import { page, create, enable, disable, resetPassword, assignRoles } from '@/services/systemApp/systemUser';

export default {
  namespace: 'systemUser',

  state: {
    ...stateOfPage(),
  },

  effects: {
    ...effectsOfPage(page),

    ...effectsWithCallback(create, 'create'),

    ...effectsWithCallback(enable, 'enable'),

    ...effectsWithCallback(disable, 'disable'),

    ...effectsWithCallback(resetPassword, 'resetPassword'),

    ...effectsWithCallback(assignRoles, 'assignRoles'),
  },

  reducers: {
    ...reducersOfPage(),
  },
};
