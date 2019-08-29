import {
  stateOfPage,
  effectsOfPage,
  reducersOfPage,
  stateOfList,
  effectsOfList,
  reducersOfList,
  effectsWithCallback,
} from '@/utils/ModelTemplate';
import { page, assignMenus, create, update, del, list } from '@/services/systemApp/systemRole';
import { roleMenus } from '@/services/systemApp/systemMenu';

export default {
  namespace: 'systemRole',

  state: {
    ...stateOfPage(),
    
    ...stateOfList('roleList'),
  
    ...stateOfList('roleMenus'),
  },

  effects: {
    ...effectsOfPage(page),

    ...effectsWithCallback(assignMenus, 'assignMenus'),

    ...effectsWithCallback(create, 'create'),

    ...effectsWithCallback(update, 'update'),

    ...effectsWithCallback(del, 'del'),

    ...effectsOfList(list, 'list', 'saveRoleList'),

    ...effectsOfList(roleMenus, 'roleMenus', 'saveRolMeus'),

  },

  reducers: {
    ...reducersOfPage(),

    ...reducersOfList('saveRoleList', 'roleList'),

    ...reducersOfList('saveRoleMenus', 'roleMenus'),
    
  },
};
