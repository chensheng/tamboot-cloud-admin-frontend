import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tree, Form, Button, Modal, message, Spin } from 'antd';

const { TreeNode } = Tree;

@connect(({ systemMenu, systemRole, loading }) => ({
  systemMenu,
  systemRole,
  detailLoading: loading.effects[('systemMenu/tree', 'systemRole/roleMenus')],
  confirmLoading: loading.effects['systemRole/assignMenus'],
}))
@Form.create()
class RoleMenuModal extends PureComponent {
  static defaultProps = {
    bindShowModal: showModal => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      currentRecord: {},
    };
  }

  componentDidMount() {
    this.props.bindShowModal(this.showModal);
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/tree',
    });
  }

  showModal = (visible, currentRecord) => {
    if (currentRecord) {
      this.setState(
        {
          visible,
          currentRecord,
        },
        () => {
          this.loadRoleMenus(currentRecord.id);
        }
      );
    } else {
      this.setState({
        visible,
      });
    }
  };

  loadRoleMenus = roleId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemRole/roleMenus',
      payload: roleId,
    });
  };

  handleCheckMenu = checkedKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemRole/saveRoleMenus',
      payload: {
        roleMenus: checkedKeys,
      },
    });
  };

  okHandler = () => {
    const { currentRecord } = this.state;
    const {
      dispatch,
      systemMenu: { menuTree },
      systemRole: { roleMenus },
    } = this.props;
    const checkedKeys = this.completeCheckedKeys(menuTree, roleMenus);
    dispatch({
      type: 'systemRole/assignMenus',
      payload: {
        roleId: currentRecord.id,
        menuIds: checkedKeys,
      },
      success: () => {
        message.success('分配菜单成功');
        this.showModal(false);
      },
    });
  };

  completeCheckedKeys = (menuTree, roleMenus) => {
    const checkedKeys = [];

    if (!menuTree || !roleMenus || menuTree.length === 0 || roleMenus.length === 0) {
      return checkedKeys;
    }

    for (let i = 0; i < menuTree.length; i++) {
      const treeNode = menuTree[i];
      const children = treeNode.children;
      const checkedType = this.calculateCheckedType(treeNode, roleMenus);

      if (checkedType !== 0) {
        checkedKeys.push(treeNode.id);
      } else if (this.hasCheckedChild(treeNode, roleMenus)) {
        checkedKeys.push(treeNode.id);
      }

      if (children && children.length > 0) {
        const childCheckedKeys = this.completeCheckedKeys(children, roleMenus);
        checkedKeys.push(...childCheckedKeys);
      }
    }

    return checkedKeys;
  };

  filterCheckedKeys = (menuTree, roleMenus) => {
    const checkedKeys = [];

    if (!menuTree || !roleMenus || menuTree.length === 0 || roleMenus.length === 0) {
      return checkedKeys;
    }

    for (let i = 0; i < menuTree.length; i++) {
      const treeNode = menuTree[i];
      const children = treeNode.children;
      const checkedType = this.calculateCheckedType(treeNode, roleMenus);
      if (checkedType === 2) {
        checkedKeys.push(treeNode.id);
      }

      if (children && children.length > 0) {
        const childrenCheckedKeys = this.filterCheckedKeys(children, roleMenus);
        checkedKeys.push(...childrenCheckedKeys);
      }
    }

    return checkedKeys;
  };

  hasCheckedChild = (treeNode, roleMenus) => {
    if (!treeNode || !treeNode.children || treeNode.children.length === 0) {
      return false;
    }

    const children = treeNode.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childCheckedType = this.calculateCheckedType(child, roleMenus);
      if (childCheckedType !== 0) {
        return true;
      }
    }

    return false;
  };

  calculateCheckedType = (treeNode, roleMenus) => {
    if (!roleMenus || roleMenus.indexOf(treeNode.id) === -1) {
      return 0;
    }

    const children = treeNode.children;
    if (!children || children.length === 0) {
      return 2;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childCheckedType = this.calculateCheckedType(child, roleMenus);
      if (childCheckedType !== 2) {
        return 1;
      }
    }

    return 2;
  };

  buildMenuTree = data => {
    return data.map(item => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.id} title={item.name} {...item}>
            {this.buildMenuTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} {...item} />;
    });
  };

  renderTreeView = () => {
    const {
      systemMenu: { menuTree },
      systemRole: { roleMenus },
    } = this.props;
    const checkedKeys = this.filterCheckedKeys(menuTree, roleMenus);
    return (
      <Tree
        checkable={true}
        checkStrictly={false}
        checkedKeys={checkedKeys}
        onCheck={this.handleCheckMenu}
      >
        {this.buildMenuTree(menuTree)}
      </Tree>
    );
  };

  render() {
    const { detailLoading, confirmLoading } = this.props;

    const { visible } = this.state;

    return (
      <Modal
        destroyOnClose
        width={640}
        bodyStyle={{ padding: '10px 40px 20px' }}
        title="分配菜单"
        confirmLoading={confirmLoading}
        visible={visible}
        onOk={this.okHandler}
        onCancel={() => this.showModal(false)}
      >
        <Spin spinning={detailLoading}>{this.renderTreeView()}</Spin>
      </Modal>
    );
  }
}

export default RoleMenuModal;
