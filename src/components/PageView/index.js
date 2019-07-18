import React, { PureComponent } from 'react';
import { Input, Button, Card } from 'antd';
import StandardTable from '@/components/StandardTable';
import SearchForm from '@/components/SearchForm';

import styles from '@/utils/custom.less';

/* eslint react/no-multi-comp:0 */
class PageView extends PureComponent {
  static defaultProps = {
    selectable: false,
    loading: false,
    searchFormItems: [],
    searchFormItemLayout: { md: 6, sm: 24 },
    searchFormRowGutter: { md: 8, lg: 24, xl: 48 },
    searchFormColumnSpan: 4,
    operatorComponents: [],
    columns: [],
    pageData: {
      list: [],
      pagination: {},
    },
    pageEffectType: '',
    defaultPageNum: 1,
    defaultPageSize: 10,
    rowKey: 'id',
    bindSearch: search => {},
    bindGetSelectedRows: getSelectedRows => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
    };
  }

  componentDidMount() {
    this.props.bindSearch(this.handleSearch);
    this.props.bindGetSelectedRows(this.doGetSelectedRows);

    this.doSearch();
    const { dispatch, pageEffectType, defaultPageNum, defaultPageSize } = this.props;
  }

  handleRowSelectChange = (selectedRows) => {
    const { selectable } = this.props;
    if (!selectable) {
      return;
    }

    this.setState({
      selectedRows
    })
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch, pageEffectType } = this.props;
    const searchValues = this.getSearchValues();
    this.doSearch(searchValues, {pageNum: pagination.current, pageSize: pagination.pageSize})
  };

  handleSearch = () => {
    const searchValues = this.getSearchValues();
    this.doSearch(searchValues);
  }

  doReset = () => {
    const { defaultPageNum, defaultPageSize } = this.props;
    this.doSearch({}, {pageNum: defaultPageNum, pageSize: defaultPageSize});
  };

  doSearch = (searchValues, pagination) => {
    const {
      dispatch,
      pageEffectType,
      defaultPageNum,
      defaultPageSize,
    } = this.props;

    const queryParams = searchValues?searchValues:{};
    const pageParams = {};
    if (pagination) {
      pageParams.pageNum = pagination.pageNum;
      pageParams.pageSize = pagination.pageSize;
    } else {
      const propsPagination = this.props.pageData.pagination;
      pageParams.pageNum = (propsPagination&&propsPagination.pageNum?propsPagination.pageNum:defaultPageNum);
      pageParams.pageSize = (propsPagination&&propsPagination.pageSize?propsPagination.pageSize:defaultPageSize);
    }

    const params = {
      ...queryParams,
      ...pageParams
    };

    dispatch({
      type: pageEffectType,
      payload: params,
    });
  }

  doGetSelectedRows = () => {
    return this.state.selectedRows;
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
      onSearch: this.doSearch,
      onReset: this.doReset
    }

    return <SearchForm {...searchFormProps} {...searchFormMethods}/>
  }

  render() {
    const { pageData, loading, columns, rowKey, operatorComponents, selectable } = this.props;

    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <div className={styles.tableListOperator}>
            {operatorComponents.map(operator => operator)}
          </div>
          <StandardTable
            rowKey={rowKey}
            loading={loading}
            selectable={selectable}
            data={pageData}
            columns={columns}
            onChange={this.handleStandardTableChange}
            onSelectRow={this.handleRowSelectChange}
          />
        </div>
      </Card>
    );
  }
}

export default PageView;
