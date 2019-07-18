import React, { PureComponent } from 'react';
import { Form, Modal, Spin } from 'antd';

const FormItem = Form.Item;

@Form.create()
class UpdateModal extends PureComponent {
  static defaultProps = {
    title: '',
    formItems: [],
    formItemLayout: {
      labelCol: { span: 5 },  
      wrapperCol: { span: 15 }
    },
    loading: false,
    confirmLoading: false,
    bindShowModal: (showModal) => {},
    onConfirm: (fieldsValue, resetForm) => {}
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      currentRecord: {}
    }
  }

  componentDidMount() {
    this.props.bindShowModal(this.showModal);
  }

  showModal = (visible, currentRecord) => {
    if (currentRecord) {
      this.setState({
        currentRecord,
        visible
      })
    } else {
      this.setState({
        visible
      })
    }
  }

  okHandler  = () => {
    const { form, onConfirm } = this.props;
    const { currentRecord } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const updatedFieldsValue = {
        ...currentRecord,
        ...fieldsValue
      }
      onConfirm(updatedFieldsValue, this.resolve);
    });
  }

  resolve = () => {
    const { form } = this.props;
    form.resetFields();
    this.showModal(false);
  }

  render() {
    const { title, loading, confirmLoading, form, formItems, formItemLayout } = this.props;

    const { visible, currentRecord } = this.state;

    return (
      <Modal
        destroyOnClose
        title={title}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.okHandler}
        onCancel={() => this.showModal(false)}
      >
        <Spin spinning={loading}>
          {formItems.map((item) => {
            return (
              <FormItem {...formItemLayout} label={item.label} key={item.name}>
                {form.getFieldDecorator(item.name, {
                  rules: item.rules?item.rules:[],
                  initialValue: currentRecord[item.name]
                })(item.component)}
              </FormItem>
            )
          })}
        </Spin>
      </Modal>
    )
  }
}

export default UpdateModal;
