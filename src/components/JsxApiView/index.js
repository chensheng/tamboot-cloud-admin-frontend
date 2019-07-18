import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';

class JsxApiView extends PureComponent {
    static defaultProps = {
        title: 'API',
        data: []
    }

    columns = [
        {title: '参数', dataIndex: 'prop', key: 'prop', render: val => (<span style={{color: '#003a8c'}}>{val}</span>)},
        {title: '说明', dataIndex: 'desc', key: 'desc', render: val=> (val)},
        {title: '类型', dataIndex: 'type', key: 'type', render: val => (<span style={{color: '#c41d7f'}}>{val}</span>)},
        {title: '默认值', dataIndex: 'default', key: 'default'}
    ];

    render() {
        return <Card title={this.props.title} bordered={false}><Table pagination={false} dataSource={this.props.data} columns={this.columns}/></Card>;
    }
}

export default JsxApiView;