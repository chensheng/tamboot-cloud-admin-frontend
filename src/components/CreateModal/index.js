import React, { PureComponent } from 'react';
import { Form, Modal } from 'antd';

const FormItem = Form.Item;

@Form.create()
class CreateModal extends PureComponent {
  static defaultProps = {
    title: '',
    formItems: [],
    formItemLayout: {
      labelCol: { span: 5 },  
      wrapperCol: { span: 15 }
    },
    confirmLoading: false,
    bindShowModal: (showModal) => {},
    onConfirm: (fieldsValue, resetForm) => {}
  }

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    this.props.bindShowModal(this.showModal);
  }

  showModal = (visible) => {
    this.setState({
      visible
    })
  }

  okHandler  = () => {
    const { form, onConfirm } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onConfirm(fieldsValue, this.resolve);
    });
  }

  resolve = () => {
    const { form } = this.props;
    form.resetFields();
    this.showModal(false);
  }

  render() {
    const { title, confirmLoading, form, formItems, formItemLayout } = this.props;

    const { visible } = this.state;

    return (
      <Modal
        destroyOnClose
        title={title}
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.okHandler}
        onCancel={() => this.showModal(false)}
      >
        {formItems.map((item) => {
          return (
            <FormItem {...formItemLayout} label={item.label} key={item.name}>
              {form.getFieldDecorator(item.name, {
                rules: item.rules?item.rules:[]
              })(item.component)}
            </FormItem>
          )
        })}
      </Modal>
    )
  }
}

export default CreateModal;
