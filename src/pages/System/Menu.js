import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Form, Input, InputNumber, Button, Card, Icon, message } from 'antd';
import Grid from 'antd/lib/card/Grid';
import UpdateModal from '@/components/UpdateModal';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { showConfirmDialog } from '@/components/ConfirmDialog';

const { TreeNode } = Tree;
const FormItem = Form.Item;

@connect(({ systemMenu, loading }) => ({
  systemMenu,
  treeLoading: loading.effects['systemMenu/tree'],
  updateLoading: loading.effects['systemMenu/update'],
  createLoading: loading.effects['systemMenu/create'],
}))
@Form.create()
class Menu extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemMenu/tree',
    });
  }

  handleSelectMenu = (selectedKeys, info) => {
    const { dispatch, form } = this.props;
    if (!info || !info.selectedNodes || info.selectedNodes.length == 0) {
      dispatch({
        type: 'systemMenu/select',
        payload: {},
        success: () => {
          form.resetFields();
        },
      });
      return;
    }

    const props = info.selectedNodes[0].props;
    const selectedMenu = {
      id: props.id,
      name: props.name,
      path: props.path,
      icon: props.icon,
      orderIndex: props.orderIndex,
      locale: props.locale,
    };
    dispatch({
      type: 'systemMenu/select',
      payload: selectedMenu,
      success: () => {
        form.resetFields();
      },
    });
  };

  handleUpdate = () => {
    const {
      dispatch,
      form,
      systemMenu: { selectedMenu: oldSelectedMenu },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const selectedMenu = { ...oldSelectedMenu, ...fieldsValue };
      dispatch({
        type: 'systemMenu/update',
        payload: selectedMenu,
        success: () => {
          form.resetFields();
        },
      });
    });
  };

  handleCreate = (fieldsValue, resolve) => {
    const {
      dispatch,
      systemMenu: { selectedMenu },
    } = this.props;
    fieldsValue.parentName = undefined;
    fieldsValue.parent = selectedMenu.id;
    dispatch({
      type: 'systemMenu/create',
      payload: fieldsValue,
      success: () => {
        resolve();
      },
    });
  };

  handleDelete = () => {
    const {
      dispatch,
      systemMenu: { selectedMenu },
    } = this.props;
    if (!selectedMenu || !selectedMenu.id) {
      message.warning('请选择要删除的菜单');
      return;
    }

    const dialogContent = `菜单【${selectedMenu.name}】，删除后将无法恢复！`;
    showConfirmDialog(
      '确认要删除菜单?',
      dialogContent,
      dispatch,
      'systemMenu/del',
      selectedMenu.id,
      () => {
        message.success('菜单已删除');
      }
    );
  };

  buildMenuTree(data) {
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
  }

  renderCreateModal = () => {
    const formItems = [
      { label: '父菜单', name: 'parentName', component: <Input disabled={true} /> },
      {
        label: '名称',
        name: 'name',
        component: <Input />,
        rules: [{ required: true, message: '请输入名称' }],
      },
      {
        label: '地址',
        name: 'path',
        component: <Input />,
        rules: [{ required: true, message: '请输入地址' }],
      },
      {
        label: '排序',
        name: 'orderIndex',
        component: <InputNumber min={0} step={1} style={{ width: '100%' }} />,
      },
      { label: '图标', name: 'icon', component: <Input /> },
    ];

    const modalProps = {
      title: '添加子菜单',
      confirmLoading: this.props.createLoading,
      formItems: formItems,
    };

    const modalMethods = {
      bindShowModal: showModal => {
        this.showCreateModal = showModal;
      },
      onConfirm: this.handleCreate,
    };

    return <UpdateModal {...modalProps} {...modalMethods} />;
  };

  renderMenuInfoView = () => {
    const {
      systemMenu: { selectedMenu },
      updateLoading,
      form,
    } = this.props;

    const operatorComponent = (
      <div>
        <a
          href="javascript:;"
          onClick={() => {
            this.showCreateModal(true, { parentName: selectedMenu.name });
          }}
        >
          添加子菜单
        </a>
        <span style={{ color: '#dddddd' }}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="javascript:;" onClick={this.handleDelete}>
          删除
        </a>
      </div>
    );

    return (
      <Card
        title={
          <div>
            <Icon type="profile" />
            &nbsp;菜单信息
          </div>
        }
        bordered={false}
        extra={operatorComponent}
      >
        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          style={{ backgroundColor: 'white', padding: '5px 0' }}
        >
          <FormItem key="name" label="名称">
            {form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入名称！' }],
              initialValue: selectedMenu.name,
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem key="path" label="地址">
            {form.getFieldDecorator('path', {
              rules: [{ required: true, message: '请输入地址！' }],
              initialValue: selectedMenu.path,
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem key="orderIndex" label="排序">
            {form.getFieldDecorator('orderIndex', {
              initialValue: selectedMenu.orderIndex,
            })(<InputNumber min={0} step={1} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem key="icon" label="图标">
            {form.getFieldDecorator('icon', {
              initialValue: selectedMenu.icon,
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem key="button" wrapperCol={{ span: 14, offset: 4 }}>
            <Button type="primary" block onClick={this.handleUpdate} loading={updateLoading}>
              保存
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  };

  renderMenuTree = () => {
    const {
      systemMenu: { menuTree, selectedMenu },
      treeLoading,
    } = this.props;

    return (
      <Card
        title={
          <div>
            <Icon type="cluster" />
            &nbsp;菜单树
          </div>
        }
        bordered={false}
      >
        <Tree
          loading={treeLoading}
          showLine={true}
          onSelect={this.handleSelectMenu}
          selectedKeys={selectedMenu && selectedMenu.id ? [selectedMenu.id] : []}
        >
          {this.buildMenuTree(menuTree)}
        </Tree>
      </Card>
    );
  };

  render() {
    return (
      <PageHeaderWrapper>
        <Row gutter={16}>
          <Col className="gutter-row" lg={7} md={10}>
            {this.renderMenuTree()}
          </Col>
          <Col className="gutter-row" lg={17} md={14}>
            {this.renderMenuInfoView()}
          </Col>
        </Row>
        {this.renderCreateModal()}
      </PageHeaderWrapper>
    );
  }
}

export default Menu;
