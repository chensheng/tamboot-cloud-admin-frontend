import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Input, Select, Button, message, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageView from '@/components/PageView';
import CreateModal from '@/components/CreateModal';
import UpdateModal from '@/components/UpdateModal';
import { showConfirmDialog } from '@/components/ConfirmDialog';
import { StatusDict } from '@/utils/dataDicts';
import { Status } from '@/utils/constants';
import { createByDataDict } from '@/utils/selectUtils';

const Option = Select.Option;

@connect(({ systemUser, systemRole, loading }) => ({
  systemUser,
  systemRole,
  pageViewLoading: loading.effects['systemUser/page'],
  createLoading: loading.effects['systemUser/create'],
  resetPasswordLoading: loading.effects['systemUser/resetPassword'],
  assignRolesLoading: loading.effects['systemUser/assignRoles'],
}))
class User extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemRole/list',
    });
  }

  handleCreate = (fieldsValue, resolve) => {
    if (fieldsValue.password !== fieldsValue.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }

    fieldsValue.confirmPassword = undefined;
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/create',
      payload: fieldsValue,
      success: () => {
        message.success('新建用户成功');
        resolve();
        this.refreshPageView();
      },
    });
  };

  handleResetPassword = (fieldsValue, resolve) => {
    if (fieldsValue.password !== fieldsValue.confirmPassword) {
      message.error('两次密码输入不一致');
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/resetPassword',
      payload: {
        userId: fieldsValue.id,
        password: fieldsValue.password,
      },
      success: () => {
        message.success('重置密码成功');
        resolve();
        this.refreshPageView();
      },
    });
  };

  handleAssignRoles = (fieldsValue, resolve) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemUser/assignRoles',
      payload: {
        userId: fieldsValue.id,
        roleCodes: fieldsValue.roleCodeList,
      },
      success: () => {
        message.success('分配角色成功');
        resolve();
        this.refreshPageView();
      },
    });
  };

  handleEnable = record => {
    const { dispatch } = this.props;
    const refreshPageView = this.refreshPageView;
    showConfirmDialog(
      '确认要启用这个用户?',
      record.username,
      dispatch,
      'systemUser/enable',
      record.id,
      () => {
        message.success('用户已启用');
        refreshPageView();
      }
    );
  };

  handleDisable = record => {
    const { dispatch } = this.props;
    const refreshPageView = this.refreshPageView;
    showConfirmDialog(
      '确认要停用这个用户?',
      record.username,
      dispatch,
      'systemUser/disable',
      record.id,
      () => {
        message.success('用户已停用');
        refreshPageView();
      }
    );
  };

  renderCreateModal = () => {
    const formItems = [
      {
        label: '用户名',
        name: 'username',
        component: <Input />,
        rules: [{ required: true, message: '请输入用户名' }],
      },
      {
        label: '密码',
        name: 'password',
        component: <Input type="password" placeholder="至少8位数字、字母、特殊字符_#@!组成" />,
        rules: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
            message: '至少8位数字、字母、特殊字符_#@!组成',
          },
        ],
      },
      {
        label: '确认密码',
        name: 'confirmPassword',
        component: <Input type="password" placeholder="至少8位数字、字母、特殊字符_#@!组成" />,
        rules: [
          { required: true, message: '请输入确认密码' },
          {
            pattern: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
            message: '至少8位数字、字母、特殊字符_#@!组成',
          },
        ],
      },
    ];

    const modalProps = {
      title: '新建用户',
      formItems: formItems,
      confirmLoading: this.props.createLoading,
    };

    const modalMethods = {
      bindShowModal: showModal => {
        this.showCreateModal = showModal;
      },
      onConfirm: this.handleCreate,
    };

    return <CreateModal {...modalProps} {...modalMethods} />;
  };

  renderResetPasswordModal = () => {
    const formItems = [
      { label: '用户名', name: 'username', component: <Input disabled={true} /> },
      {
        label: '密码',
        name: 'password',
        component: <Input type="password" placeholder="至少8位数字、字母、特殊字符_#@!组成" />,
        rules: [
          { required: true, message: '请输入密码' },
          {
            pattern: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
            message: '至少8位数字、字母、特殊字符_#@!组成',
          },
        ],
      },
      {
        label: '确认密码',
        name: 'confirmPassword',
        component: <Input type="password" placeholder="至少8位数字、字母、特殊字符_#@!组成" />,
        rules: [
          { required: true, message: '请输入确认密码' },
          {
            pattern: /^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
            message: '至少8位数字、字母、特殊字符_#@!组成',
          },
        ],
      },
    ];

    const modalProps = {
      title: '重置密码',
      formItems: formItems,
      confirmLoading: this.props.resetPasswordLoading,
    };

    const modalMethods = {
      bindShowModal: showModal => {
        this.showResetPasswordModal = showModal;
      },
      onConfirm: this.handleResetPassword,
    };

    return <UpdateModal {...modalProps} {...modalMethods} />;
  };

  renderAssignRolesModal = () => {
    const {
      systemRole: { roleList },
    } = this.props;

    const formItems = [
      { label: '用户名', name: 'username', component: <Input disabled={true} /> },
      {
        label: '角色',
        name: 'roleCodeList',
        component: (
          <Select style={{ width: '100%' }} mode="multiple">
            {roleList.map(role => (
              <Option key={role.roleCode}>{role.roleName}</Option>
            ))}
          </Select>
        ),
        rules: [{ required: true, message: '请选择角色' }],
      },
    ];

    const modalProps = {
      title: '分配角色',
      formItems: formItems,
      confirmLoading: this.props.assignRolesLoading,
    };

    const modalMethods = {
      bindShowModal: showModal => {
        this.showAssignRolesModal = showModal;
      },
      onConfirm: this.handleAssignRoles,
    };

    return <UpdateModal {...modalProps} {...modalMethods} />;
  };

  renderPageView = () => {
    const {
      dispatch,
      systemUser: { pageData },
      systemRole: { roleList },
      pageViewLoading,
    } = this.props;

    const columns = [
      { title: '用户名', dataIndex: 'username' },
      { title: '角色', dataIndex: 'roleNameList', render: val => val.join(',') },
      { title: '状态', dataIndex: 'status', render: val => StatusDict[val] },
      {
        title: '操作',
        render: (val, record) => {
          if (record.status === Status.DISABLE) {
            return (
              <Fragment>
                <a
                  onClick={() => {
                    this.showAssignRolesModal(true, record);
                  }}
                >
                  分配角色
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    this.showResetPasswordModal(true, record);
                  }}
                >
                  重置密码
                </a>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    this.handleEnable(record);
                  }}
                >
                  启用
                </a>
              </Fragment>
            );
          }
          return (
            <Fragment>
              <a
                onClick={() => {
                  this.showAssignRolesModal(true, record);
                }}
              >
                分配角色
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.showResetPasswordModal(true, record);
                }}
              >
                重置密码
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleDisable(record);
                }}
              >
                停用
              </a>
            </Fragment>
          );
        },
      },
    ];

    const searchFormItems = [
      { label: '用户名', name: 'usernameLike', component: <Input placeholder="支持模糊查询" /> },
      {
        label: '角色',
        name: 'roleCode',
        component: (
          <Select>
            {roleList.map(role => (
              <Option key={role.roleCode}>{role.roleName}</Option>
            ))}
          </Select>
        ),
      },
      { label: '状态', name: 'status', component: createByDataDict(StatusDict) },
    ];

    const operatorComponents = [
      <Button
        key="create"
        icon="plus"
        type="primary"
        onClick={() => {
          this.showCreateModal(true);
        }}
      >
        新建
      </Button>,
    ];

    return (
      <PageView
        bindSearch={search => {
          this.refreshPageView = search;
        }}
        dispatch={dispatch}
        loading={pageViewLoading}
        pageData={pageData}
        pageEffectType="systemUser/page"
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
        {this.renderResetPasswordModal()}
        {this.renderAssignRolesModal()}
      </PageHeaderWrapper>
    );
  }
}

export default User;
