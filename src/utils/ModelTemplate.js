export function stateOfPage(stateName = 'pageData') {
  return {
    [stateName]: {
      list: [],
      pagination: {},
    },
  };
}

export function effectsOfPage(pageService, funcName = 'page', pageNumReducerName='savePageNum', pageDataReducerName='savePageData') {
  return {
    *[funcName]({ payload }, { call, put }) {
      yield put({
        type: pageNumReducerName,
        payload: {
          pageNum: payload.pageNum,
        },
      });

      const response = yield call(pageService, payload);
      if (!response) {
        return;
      }

      yield put({
        type: pageDataReducerName,
        payload: {
          list: response.data.result,
          pagination: {
            current: response.data.pageNum,
            total: response.data.total,
            pageSize: response.data.pageSize,
          },
        },
      });
    },
  };
}

export function reducersOfPage(pageNumReducerName='savePageNum', pageDataReducerName='savePageData', stateName='pageData') {
  return {
    [pageDataReducerName](state, action) {
      return {
        ...state,
        [stateName]: action.payload,
      };
    },

    [pageNumReducerName](state, action) {
      return {
        ...state,
        [stateName]: {
          ...state[stateName],
          pagination: {
            ...state[stateName].pagination,
            current: action.payload.pageNum,
          },
        },
      };
    },
  };
}

export function stateOfList(stateName = 'listData') {
  return {
    [stateName]: [],
  };
}

export function effectsOfList(listService, funcName = 'list', reducerName = 'saveList') {
  return {
    *[funcName]({ payload }, { call, put }) {
      const response = yield call(listService, payload);
      if (!response) {
        return;
      }

      yield put({
        type: reducerName,
        payload: response.data
      });
    },
  };
}

export function reducersOfList(reducerName = 'saveList', stateName='listData') {
  return {
    [reducerName](state, action) {
      return {
        ...state,
        [stateName]: action.payload,
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
