import {
  stateOfPage,
  effectsOfPage,
  reducersOfPage,
  effectsWithCallback,
} from '@/utils/ModelTemplate';
import { page, assignMenus, create, update, del, list } from '@/services/systemApp/systemRole';
import { roleMenus } from '@/services/systemApp/systemMenu';

export default {
  namespace: 'systemRole',

  state: {
    ...stateOfPage(),
    roleMenus: [],
    roleList: [],
  },

  effects: {
    ...effectsOfPage(page),

    ...effectsWithCallback(assignMenus, 'assignMenus'),

    ...effectsWithCallback(create, 'create'),

    ...effectsWithCallback(update, 'update'),

    ...effectsWithCallback(del, 'del'),

    *roleMenus({ payload }, { call, put }) {
      const response = yield call(roleMenus, payload);
      yield put({
        type: 'saveRoleMenus',
        payload: {
          roleMenus: response ? response.data : [],
        },
      });
    },

    *list({ _ }, { call, put }) {
      const response = yield call(list);
      yield put({
        type: 'saveRoleList',
        payload: {
          roleList: response && response.data ? response.data : [],
        },
      });
    },
  },

  reducers: {
    ...reducersOfPage(),

    saveRoleMenus(state, action) {
      return {
        ...state,
        roleMenus: action.payload.roleMenus,
      };
    },

    saveRoleList(state, action) {
      return {
        ...state,
        roleList: action.payload.roleList,
      };
    },
  },
};
