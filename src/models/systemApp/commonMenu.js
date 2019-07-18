import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { menu } from '@/defaultSettings';
import { tree as treeMenu } from '@/services/systemApp/commonMenu';

function formatter(data) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      if (!item.target && item.path.indexOf('http') === 0) {
        item.target = '_blank';
      }
      
      if (item.children) {
        const children = formatter(item.children);
        item.children = children;
      }
      return item;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'commonMenu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ _ }, { call, put }) {
      const response = yield call(treeMenu);
      const menuData = memoizeOneFormatter(response.data);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
