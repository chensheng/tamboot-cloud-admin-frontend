import React, { PureComponent } from 'react';
import { Form, Button, Card, Spin } from 'antd';

const FormItem = Form.Item;

@Form.create()
class FormView extends PureComponent {
  static defaultProps = {
    formItems: [],
    formItemLayout: {
      labelCol: { xs: { span: 24 }, sm: { span: 7 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 10 } },
    },
    submitItemLayout: {
      wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 10, offset: 7 } },
    },
    submitText: '提交',
    loading: false,
    submitLoading: false,
    initialValues: {},
    onSubmit: (fieldsValue, resolve) => {},
  };

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      initialValues: props.initialValues ? props.initialValues : {},
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      initialValues: {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      onSubmit && onSubmit(fieldsValue, this.resolve);
    });
  };

  resolve = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const {
      formItemLayout,
      submitItemLayout,
      form,
      formItems,
      loading,
      submitLoading,
      submitText,
    } = this.props;

    const { initialValues } = this.state;

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <Spin spinning={loading}>
            {formItems.map(item => {
              return (
                <FormItem {...formItemLayout} label={item.label} key={item.name}>
                  {form.getFieldDecorator(item.name, {
                    rules: item.rules ? item.rules : [],
                    initialValue: initialValues[item.name],
                  })(item.component)}
                </FormItem>
              );
            })}
            <FormItem {...submitItemLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                style={{ width: '100%' }}
              >
                {submitText}
              </Button>
            </FormItem>
          </Spin>
        </Form>
      </Card>
    );
  }
}

export default FormView;
