import { routerRedux } from 'dva/router';
import { login } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { BusinessCode } from '@/utils/constants';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    msg: '',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (!response) {
        return;
      }

      if (response.code === BusinessCode.FAIL) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            msg: response.msg,
          },
        });
        return;
      }

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'success',
        },
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });

      yield put(
        routerRedux.push({
          pathname: '/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        msg: payload.msg,
      };
    },
  },
};
