import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Divider, Button, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageView from '@/components/PageView';
import Ellipsis from '@/components/Ellipsis';
import RoleMenuModal from '@/components/RoleMenuModal';
import CreateModal from '@/components/CreateModal';
import UpdateModal from '@/components/UpdateModal';
import TableRowActions from '@/components/TableRowActions';
import { showConfirmDialog } from '@/components/ConfirmDialog';

/* eslint react/no-multi-comp:0 */
@connect(({ systemRole, loading }) => ({
  systemRole,
  pageViewLoading: loading.effects['systemRole/page'],
  createLoading: loading.effects['systemRole/create'],
  updateLoading: loading.effects['systemRole/update'],
}))
class Role extends PureComponent {
  handleCreate = (fieldsValue, resolve) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemRole/create',
      payload: fieldsValue,
      success: () => {
        resolve();
        this.refreshPageView();
      },
    });
  };

  handleUpdate = (fieldsValue, resolve) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemRole/update',
      payload: fieldsValue,
      success: () => {
        resolve();
        this.refreshPageView();
      },
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    const refreshPageView = this.refreshPageView;
    showConfirmDialog(
      '确认要删除这个角色?',
      record.roleName,
      dispatch,
      'systemRole/del',
      record.id,
      () => {
        message.success('角色已删除');
        refreshPageView();
      }
    );
  };

  renderCreateModal = () => {
    const formItems = [
      { label: '编码', name: 'roleCode', component: <Input placeholder="由大写字母、下划线组成" />,
        rules: [
          { required: true, message: '请输入编码' },
          { pattern: new RegExp(/^[A-Z_]+$/), message: '角色编码由大写字母、下划线组成' },
        ],
      },
      { label: '名称', name: 'roleName', component: <Input placeholder="必填" />, rules: [{ required: true, message: '请输入名称' }] },
      { label: '描述', name: 'roleDesc', component: <Input placeholder="对角色职责的描述" /> },
    ];

    const modalProps = {
      title: '新建角色',
      formItems: formItems,
      confirmLoading: this.props.createLoading,
    };

    const modalMethods = {
      bindShowModal: showModal => { this.showCreateModal = showModal;},
      onConfirm: this.handleCreate,
    };

    return <CreateModal {...modalProps} {...modalMethods} />;
  };

  renderUpdateModal = () => {
    const formItems = [
      { label: '编码', name: 'roleCode', component: <Input disabled={true} /> },
      { label: '名称', name: 'roleName', component: <Input placeholder="必填" />, rules: [{ required: true, message: '请输入名称' }],},
      { label: '描述', name: 'roleDesc', component: <Input placeholder="对角色职责的描述" /> },
    ];

    const modalProps = {
      title: '修改角色',
      formItems: formItems,
      confirmLoading: this.props.updateLoading,
    };

    const modalMethods = {
      bindShowModal: showModal => {this.showUpdateModal = showModal;},
      onConfirm: this.handleUpdate,
    };

    return <UpdateModal {...modalProps} {...modalMethods} />;
  };

  renderRoleMenuModal = () => {
    const modalMethods = {
      bindShowModal: showModal => {this.showRoleMenuModal = showModal;},
    };

    return <RoleMenuModal {...modalMethods} />;
  };

  renderPageView = () => {
    const actions = [
      { name: '分配菜单', onClick: (text, record, index) => {this.showRoleMenuModal(true, record)}},
      { name: '修改', onClick: (text, record, index) => {this.showUpdateModal(true, record);}},
      { name: '删除', onClick: (text, record, index) => {this.handleDelete(record);}}
    ];

    const columns = [
      { title: '编码', dataIndex: 'roleCode' },
      { title: '名称', dataIndex: 'roleName' },
      { title: '描述', dataIndex: 'roleDesc', render: text => (<Ellipsis length={10} lines={1} tooltip={true}>{text}</Ellipsis>)},
      { title: '操作', render: (text, record, index) => (<TableRowActions actions={actions} text={text} record={record} index={index}/>)},
    ];

    const searchFormItems = [
      { label: '编码', name: 'roleCodeLike', component: <Input /> },
      { label: '名称', name: 'roleNameLike', component: <Input /> },
    ];

    const operatorComponents = [
      <Button key="create" icon="plus" type="primary" onClick={() => this.showCreateModal(true)}>新建</Button>,
    ];

    const { dispatch, systemRole: { pageData }, pageViewLoading, } = this.props;

    return (
      <PageView
        bindRefresh={func => {this.refreshPageView = func;}}
        dispatch={dispatch}
        loading={pageViewLoading}
        data={pageData}
        effectType="systemRole/page"
        columns={columns}
        searchFormItems={searchFormItems}
        operatorComponents={operatorComponents}
      />
    );
  };

  render() {
    return (
      <PageHeaderWrapper>
        {this.renderPageView()}
        {this.renderCreateModal()}
        {this.renderUpdateModal()}
        {this.renderRoleMenuModal()}
      </PageHeaderWrapper>
    );
  }
}

export default Role;
