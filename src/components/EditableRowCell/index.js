import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

const Option = Select.Option;
const EditableContext = React.createContext();

const PureEditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props}/>
    </EditableContext.Provider>
)

const EditableRow = Form.create()(PureEditableRow);

class EditableCell extends React.Component {
    static defaultProps = {
        editType: 'text',
        editRules: [],
        editData: {},
        editProps: {},
        handleSave: (fieldsValue) => {},
    };

    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
          if (editing) {
            this.input.focus();
          }
        });
    }

    save = e => {
        const { record, dataIndex, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            
            this.toggleEdit();
            if (record[dataIndex] === values[dataIndex]) {
                return;
            }

            handleSave({ ...record, ...values });
        });
    }

    getInput = () => {
        const { editType, editData, editProps } = this.props;
        const inputProps = {
            ref: node => (this.input = node),
            onPressEnter: this.save,
            onBlur: this.save,
            ...editProps
        }

        if (editType === 'number') {
            return <InputNumber {...inputProps}/>;
        }

        if (editType === 'select') {
            return (
                <Select {...inputProps} style={{width: '100%'}}>
                    {Object.keys(editData).map(value => (
                        <Option key={value}>{editData[value]}</Option>
                    ))}
                </Select>
            )
        }

        return <Input {...inputProps}/>;
    }

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title, editRules } = this.props;
        const { editing } = this.state;

        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: editRules,
                    initialValue: record[dataIndex],
                })(this.getInput())}
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={this.toggleEdit} >{children}</div>
        )
    }

    render() {
        const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        )
    }
}

export { EditableRow, EditableCell };