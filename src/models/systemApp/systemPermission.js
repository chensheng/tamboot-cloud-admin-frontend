import {
  stateOfPage,
  effectsOfPage,
  reducersOfPage,
  effectsWithCallback,
} from '@/utils/ModelTemplate';
import { page, create, update, del, refresh } from '@/services/systemApp/systemPermission';

export default {
  namespace: 'systemPermission',

  state: {
    ...stateOfPage(),
  },

  effects: {
    ...effectsOfPage(page),

    ...effectsWithCallback(create, 'create'),

    ...effectsWithCallback(update, 'update'),

    ...effectsWithCallback(del, 'del'),

    ...effectsWithCallback(refresh, 'refresh'),
  },

  reducers: {
    ...reducersOfPage(),
  },
};
