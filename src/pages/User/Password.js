import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FormView from '@/components/FormView';
import { RegPattern } from '@/utils/constants';

@connect(({ loading }) => ({
  submitLoading: loading.effects['commonUser/updatePassword'],
}))
class Password extends PureComponent {
  handleSubmit = (fieldsValue, resolve) => {
    const { dispatch } = this.props;
    if (fieldsValue.newPassword !== fieldsValue.confirmPassword) {
      message.warning(formatMessage({ id: 'form.result.passwordInconsistent' }));
      return;
    }

    // eslint-disable-next-line
    fieldsValue.confirmPassword = undefined;
    dispatch({
      type: 'commonUser/updatePassword',
      payload: fieldsValue,
      success: () => {
        message.success(formatMessage({ id: 'form.result.passwordUpdateSuccess' }));
        resolve();
      },
    });
  };

  render() {
    const { submitLoading } = this.props;

    const formItems = [
      {
        label: formatMessage({ id: 'form.label.oldPassword' }),
        name: 'oldPassword',
        component: (
          <Input
            type="password"
            placeholder={formatMessage({ id: 'form.validation.msg.required.oldPassword' })}
          />
        ),
        rules: [
          {
            required: true,
            message: formatMessage({ id: 'form.validation.msg.required.oldPassword' }),
          },
        ],
      },
      {
        label: formatMessage({ id: 'form.label.newPassword' }),
        name: 'newPassword',
        component: (
          <Input
            type="password"
            placeholder={formatMessage({ id: 'form.placeholder.passwordFormat' })}
          />
        ),
        rules: [
          {
            required: true,
            message: formatMessage({ id: 'form.validation.msg.required.newPassword' }),
          },
          {
            pattern: RegPattern.PASSWORD,
            message: formatMessage({ id: 'form.validation.msg.pattern.passwordFormat' }),
          },
        ],
      },
      {
        label: formatMessage({ id: 'form.label.confirmPassword' }),
        name: 'confirmPassword',
        component: (
          <Input
            type="password"
            placeholder={formatMessage({ id: 'form.placeholder.passwordFormat' })}
          />
        ),
        rules: [
          {
            required: true,
            message: formatMessage({ id: 'form.validation.msg.required.confirmPassword' }),
          },
          {
            pattern: RegPattern.PASSWORD,
            message: formatMessage({ id: 'form.validation.msg.pattern.passwordFormat' }),
          },
        ],
      },
    ];

    return (
      <PageHeaderWrapper>
        <FormView
          formItems={formItems}
          submitLoading={submitLoading}
          onSubmit={this.handleSubmit}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Password;
