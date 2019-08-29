import React, { PureComponent, Fragment } from 'react';
import { Divider} from 'antd';

class TableRowActions extends PureComponent {
    static defaultProps = {
        actions: [],
        text: '',
        record: {},
        index: 0
    }

    render() {
        const { actions, text, record, index } = this.props;
        const actionViews = [];
        actions.map((action) => {
            let visible = true;
            if (action.checkVisible) {
                visible = action.checkVisible(text, record, index);
            }
            if (visible) {
                actionViews.push(<a onClick={() => {action.onClick&&action.onClick(text, record, index);}}>{action.name}</a>);
            }
        })

        return (
            <Fragment>
                {actionViews.map((view, index) => {
                    if (index === actionViews.length - 1) {
                        return view;
                    }
                    return <span>{view}<Divider type="vertical" /></span>
                })}
            </Fragment>
        )
    }
}

export default TableRowActions;