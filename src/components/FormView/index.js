import React, { PureComponent } from 'react';
import { Form, Button, Card, Spin, Row, Col } from 'antd';

const FormItem = Form.Item;

@Form.create()
class FormView extends PureComponent {
  static defaultProps = {
    formItems: [],
    formItemSpan: 6,
    submitText: '提交',
    submitStyle: {},
    submitMarginTop: 38,
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
      form,
      formItems,
      formItemSpan,
      loading,
      submitLoading,
      submitText,
      submitStyle,
      submitMarginTop,
      ...restProps
    } = this.props;

    const { initialValues } = this.state;

    return (
      <Card bordered={false} {...restProps}>
        <Form onSubmit={this.handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={24}>
              {formItems.map(item => {
                return (
                  <Col span={formItemSpan}>
                    <FormItem label={item.label} key={item.name}>
                      {form.getFieldDecorator(item.name, {
                        rules: item.rules ? item.rules : [],
                        initialValue: initialValues[item.name],
                      })(item.component)}
                    </FormItem>
                  </Col>
                );
              })}
              <Col span={formItemSpan}>
                <FormItem style={{marginTop: submitMarginTop}}>
                  <Button type="primary" htmlType="submit" style={submitStyle} loading={submitLoading}>
                    {submitText}
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Card>
    );
  }
}

export default FormView;
