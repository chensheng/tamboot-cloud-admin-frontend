import React, { PureComponent } from 'react';
import { Input, Button, Card } from 'antd';
import StandardTable from '@/components/StandardTable';
import { EditableRow, EditableCell } from '@/components/EditableRowCell';
import styles from '@/utils/custom.less';
import { object } from 'prop-types';

/* eslint react/no-multi-comp:0 */
class ListView extends PureComponent {
    static defaultProps = {
        selectable: false,
        loading: false,
        hidePagination: true,
        queryComponent: undefined,
        operatorComponents: [],
        columns: [],
        data: [],
        effectType: '',
        reducerType: '',
        rowKey: 'id',
        dispatch: () => {},
        bindRefresh: refresh => {},
        bindGetSelectedRows: getSelectedRows => {},
        bindAddRow: addRow => {},
        bindDeleteRow: deleteRow => {},
        onSaveRow: fieldsValue => {},
        getQueryParams: (pagination) => ({})
    };

    state = {
        selectedRows: [],
    };
    
    componentDidMount() {
        this.props.bindRefresh(this.doRefresh);
        this.props.bindGetSelectedRows(this.doGetSelectedRows);
        this.props.bindAddRow(this.doAddRow);
        this.props.bindDeleteRow(this.doDeleteRow);
        this.doRefresh();
    }
    
    handleRowSelectChange = (selectedRows) => {
        const { selectable } = this.props;
        if (!selectable) {
            return;
        }
        
        this.setState({ selectedRows });
    }
    
    handleStandardTableChange = (pagination) => {
        this.doRefresh({pageNum: pagination.current, pageSize: pagination.pageSize});
    }
    
    doRefresh = (pageParams) => {
        const { dispatch, effectType, getQueryParams } = this.props;
        const queryParams = getQueryParams(pageParams);
        dispatch({
            type: effectType,
            payload: queryParams
        });
    }
    
    doGetSelectedRows = () => {
        return this.state.selectedRows;
    }

    doAddRow = () => {
        const { data, reducerType, dispatch, columns, rowKey } = this.props;
        
        const newRow = {isNew: true};
        newRow[rowKey] = `new-${new Date().getTime()}`;
        columns.map((column) => {
            if (column.dataIndex !== rowKey) {
                newRow[column.dataIndex] = column.editDefault?column.editDefault:'';
            }
        });

        let payload;
        if (Array.isArray(data)) {
            payload = [newRow, ...data];
        } else {
            payload = {...data, list: [newRow, ...data.list]};
        }
        dispatch({
            type: reducerType,
            payload: payload
        })
    }

    doDeleteRow = (record) => {
        if (!record || !record.isNew) {
            return;
        }
        
        const { data, reducerType, dispatch, rowKey } = this.props;
        let payload;
        if (Array.isArray(data)) {
            payload = data.filter(item => item[rowKey] !== record[rowKey]);
        } else {
            payload = {...data, list: data.list.filter(item => item[rowKey] !== record[rowKey])}
        }
        dispatch({
            type: reducerType,
            payload: payload
        })
    }

    decorateEditableCell = (columns) => {
        const { onSaveRow } = this.props;
        return columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editType: col.editType,
                    editRules: col.editRules,
                    editData: col.editData,
                    editProps: col.editProps,
                    handleSave: onSaveRow
                })
            }
        })
    }

    decorateData = (data) => {
        if (!data || !Array.isArray(data)) {
            return data;
        }

        return {list: data};
    }
    
    render() {
        const { data, columns, queryComponent, operatorComponents, hidePagination, ...restProps } = this.props;
        const tableComponents = { body: { row: EditableRow, cell: EditableCell } };
        const tableColumns = this.decorateEditableCell(columns);
        const tableData = this.decorateData(data);
        const paginationProps = hidePagination?{pagination: false}:{};

        return (
            <Card bordered={false}>
                <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{queryComponent}</div>
                    <div className={styles.tableListOperator}>{operatorComponents.map(operator => operator)}</div>
                    <StandardTable
                        data={tableData}
                        columns={tableColumns}
                        onChange={this.handleStandardTableChange}
                        onSelectRow={this.handleRowSelectChange}
                        components={tableComponents}
                        rowClassName={() => 'editable-row'}
                        {...paginationProps}
                        {...restProps}
                    />
                </div>
            </Card>
        );
    }
}

export default ListView;
