import { effectsWithCallback } from '@/utils/ModelTemplate';
import { details, refreshToken, updatePassword } from '@/services/systemApp/commonUser';

export default {
  namespace: 'commonUser',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(details);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },

    *refreshToken(_, { call, put }) {
      yield call(refreshToken);
    },

    ...effectsWithCallback(updatePassword, 'updatePassword'),
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
