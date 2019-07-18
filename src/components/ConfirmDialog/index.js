import { Modal } from 'antd';

const confirm = Modal.confirm;

export function showConfirmDialog(
  dialogTitle,
  dialogContent,
  dispatch,
  dispatchType,
  payload,
  success
) {
  confirm({
    okText: '确认',
    cancelText: '取消',
    title: `${dialogTitle ? dialogTitle : '确认要进行该操作?'}`,
    content: dialogContent ? dialogContent : '',
    onOk() {
      return new Promise((resolve, reject) => {
        dispatch({
          type: dispatchType,
          payload: payload,
          success: () => {
            resolve();
            success && success();
          },
          fail: () => {
            reject();
          },
        });
      }).catch(() => reject);
    },
    onCancel() {},
  });
}
