import React, { PureComponent } from 'react';
import SearchForm from '@/components/SearchForm';
import ListView from '@/components/ListView';

/* eslint react/no-multi-comp:0 */
class PageView extends PureComponent {
    static defaultProps = {
        searchFormItems: [],
        searchFormItemLayout: { md: 6, sm: 24 },
        searchFormRowGutter: { md: 8, lg: 24, xl: 48 },
        searchFormColumnSpan: 4,
        defaultPageNum: 1,
        defaultPageSize: 10,
        bindRefresh: refresh => {},
    };
    
    componentDidMount() {
        this.props.bindRefresh(this.refresh);
    }
    
    onReset = () => {
        const { defaultPageNum, defaultPageSize } = this.props;
        this.refresh({pageNum: defaultPageNum, pageSize: defaultPageSize});
    }

    onSearch = () => {
        const pageParams = this.doGetPageParams();
        pageParams.pageNum = 1;
        this.refresh(pageParams);
    }
    
    renderSearchForm() {
        const searchFormProps = {
            formItems: this.props.searchFormItems,
            formItemLayout: this.props.searchFormItemLayout,
            formRowGutter: this.props.searchFormRowGutter,
            formColumnSpan: this.props.searchFormColumnSpan
        }
        
        const searchFormMethods = {
            bindGetSearchValues: (func) => {this.getSearchValues = func;},
            onSearch: this.onSearch,
            onReset: this.onReset
        }
        
        return <SearchForm {...searchFormProps} {...searchFormMethods}/>
    }

    getQueryParams = (params) => {
        const searchValues = this.getSearchValues();
        const pageParams = this.doGetPageParams(params);
        return { ...searchValues, ...pageParams }
    }
    
    doGetPageParams = (params) => {
        const { data: { pagination }, defaultPageNum, defaultPageSize } = this.props;
        const pageParams = {};
        if (params&&params.pageNum&&params.pageSize) {
            pageParams.pageNum = params.pageNum;
            pageParams.pageSize = params.pageSize;
        } else {
            pageParams.pageNum = (pagination&&pagination.current?pagination.current:defaultPageNum);
            pageParams.pageSize = (pagination&&pagination.pageSize?pagination.pageSize:defaultPageSize);
        }
        return pageParams;
    }

    render() {
        const { hidePagination, queryComponent, bindRefresh, getQueryParams, ...restProps } = this.props;

        return (
            <ListView
                hidePagination={false}
                queryComponent={this.renderSearchForm()}
                bindRefresh={func => this.refresh = func}
                getQueryParams={this.getQueryParams}
                {...restProps}
            />
        );
    }
}

export default PageView;
