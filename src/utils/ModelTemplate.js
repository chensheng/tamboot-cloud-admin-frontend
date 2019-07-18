export function stateOfPage() {
  return {
    pageData: {
      list: [],
      pagination: {},
    },
  };
}

export function effectsOfPage(pageService, funcName = 'page') {
  return {
    *[funcName]({ payload }, { call, put }) {
      yield put({
        type: 'setCurrentPageNum',
        payload: {
          pageNum: payload.pageNum,
        },
      });

      const response = yield call(pageService, payload);
      if (!response) {
        return;
      }

      yield put({
        type: 'refreshPage',
        payload: {
          pageData: {
            list: response.data.result,
            pagination: {
              current: response.data.pageNum,
              total: response.data.total,
              pageSize: response.data.pageSize,
            },
          },
        },
      });
    },
  };
}

export function reducersOfPage() {
  return {
    refreshPage(state, action) {
      return {
        ...state,
        pageData: action.payload.pageData,
      };
    },

    setCurrentPageNum(state, action) {
      return {
        ...state,
        pageData: {
          ...state.pageData,
          pagination: {
            ...state.pageData.pagination,
            current: action.payload.pageNum,
          },
        },
      };
    },
  };
}

export function effectsWithCallback(service, funcName) {
  return {
    *[funcName]({ payload, success, fail }, { call }) {
      const response = yield call(service, payload);
      if (!response) {
        fail && fail();
        return;
      }

      success && success();
    },
  };
}
