import { tree, treeForRole, update, create, del } from '@/services/systemApp/systemMenu';

export default {
  namespace: 'systemMenu',

  state: {
    menuTree: [],
    selectedMenu: {},
  },

  effects: {
    *tree({ _ }, { call, put }) {
      const response = yield call(tree);
      yield put({
        type: 'saveMenuTree',
        payload: { menuTree: response.data },
      });
    },

    *update({ payload, success }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'saveSelectedMenu',
        payload: { selectedMenu: payload },
      });

      yield put({
        type: 'tree',
      });
      success && success(response);
    },

    *select({ payload, success }, { call, put }) {
      yield put({
        type: 'saveSelectedMenu',
        payload: { selectedMenu: payload },
      });

      success && success();
    },

    *create({ payload, success }, { call, put }) {
      const response = yield call(create, payload);
      yield put({
        type: 'tree',
      });
      success && success();
    },

    *del({ payload, success, fail }, { call, put }) {
      const response = yield call(del, payload);
      if (!response) {
        fail && fail();
        return;
      }

      yield put({
        type: 'saveSelectedMenu',
        payload: { selectedMenu: {} },
      });
      yield put({
        type: 'tree',
      });
      success && success(response);
    },
  },

  reducers: {
    saveMenuTree(state, action) {
      let selectedMenu = state.selectedMenu;
      if (
        (!selectedMenu || !selectedMenu.id) &&
        (action.payload.menuTree && action.payload.menuTree.length > 0)
      ) {
        selectedMenu = action.payload.menuTree[0];
      }

      return {
        ...state,
        selectedMenu,
        menuTree: action.payload.menuTree,
      };
    },

    saveSelectedMenu(state, action) {
      return {
        ...state,
        selectedMenu: action.payload.selectedMenu,
      };
    },
  },
};
