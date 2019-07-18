import React, { PureComponent } from 'react';
import { Form, Row, Col, Button } from 'antd';
import styles from '@/utils/custom.less';

const FormItem = Form.Item;

@Form.create()
class SearchForm extends PureComponent {
    static defaultProps = {
        formItems: [],
        formItemLayout: { md: 6, sm: 24 },
        formRowGutter: { md: 8, lg: 24, xl: 48 },
        formColumnSpan: 4,
        onSearch: () => {},
        onReset: () => {},
        bindGetSearchValues: (func) => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            showMore: false,
            bindGetSearchValues: {}
        }
    }

    componentDidMount() {
        this.props.bindGetSearchValues&&this.props.bindGetSearchValues(this.getSearchValues);
    }

    getSearchValues = () => {
        return this.state.searchValues;
    }

    handleSearch = (e) => {
        e&&e.preventDefault();
        const { form, onSearch } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;
      
            this.setState({
                searchValues: fieldsValue,
            });

            onSearch&&onSearch(fieldsValue);
        });
    }

    handleReset = () => {
        const { form, onReset } = this.props;
        form.resetFields();
        this.setState({
            searchValues: {},
        });
        
        onReset&&onReset();
    };

    doRenderSimple = () => {
        const {
            form: { getFieldDecorator },
            formItems,
            formItemLayout,
            formRowGutter,
            onSearch,
            onReset
        } = this.props;
    
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={formRowGutter}>
                    {formItems.map(item => {
                        return (
                        <Col {...formItemLayout} key={item.name}>
                            <FormItem label={item.label}>
                                {getFieldDecorator(item.name)(item.component)}
                            </FormItem>
                        </Col>);
                    })}
                    <Col {...formItemLayout} key="action">
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }
    
    doRenderAdvanced = () => {
        const {
            form: { getFieldDecorator },
            formItems,
            formItemLayout,
            formRowGutter,
            formColumnSpan,
            onSearch,
            onReset
        } = this.props;
    
        const { showMore } = this.state;
    
        const totalItems = formItems.length;
        const totalRows = (totalItems+1)/4 + (totalItems%4>0?1:0);
    
        const rows = [];
        let startIndex = 0, endIndex = 0;
        for (let i=1; i<=totalRows; i++) {
            if (i === 1) {
                endIndex = totalItems<(formColumnSpan-1)?totalItems:(formColumnSpan-1);
            } else {
                endIndex = (i===totalRows?totalItems:startIndex+4);
            }
            rows.push(formItems.slice(startIndex, endIndex));
            startIndex = endIndex;
        }
        
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                {rows.map((row, rowIndex) => {
                    if (rowIndex === 0) {
                        return (
                        <Row gutter={formRowGutter} key={rowIndex}>
                            {row.map((item) => (
                            <Col {...formItemLayout} key={item.name}>
                                <FormItem label={item.label}>
                                    {getFieldDecorator(item.name)(item.component)}
                                </FormItem>
                            </Col>))}
                            <Col {...formItemLayout} key="action">
                                <span className={styles.submitButtons}>
                                    <Button type="primary" htmlType="submit">查询</Button>
                                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                                    <Button style={{ marginLeft: 8 }} title="更多" type="link" icon={showMore?'up':'down'} onClick={this.handleMore}></Button>
                                </span>
                            </Col>
                        </Row>)
                    }
                    
                    return (
                    <Row gutter={formRowGutter} key={rowIndex} className={showMore?'':styles.hidden}>
                        {row.map((item) => (
                        <Col {...formItemLayout} key={item.name}>
                            <FormItem label={item.label}>
                                {getFieldDecorator(item.name)(item.component)}
                            </FormItem>
                        </Col>))}
                    </Row>)
                })}
            </Form>
        )
    }

    handleMore = () => {
        this.setState({
            showMore: !this.state.showMore
        })
    }

    render() {
        const { formItems, formColumnSpan } = this.props;
        if (formItems.length < formColumnSpan) {
            return this.doRenderSimple();
        }
    
        return this.doRenderAdvanced();
    }
}

export default SearchForm;