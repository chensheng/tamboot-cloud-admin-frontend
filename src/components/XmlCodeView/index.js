import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';

class XmlCodeView extends PureComponent {
    static defaultProps = {
        title: '代码',
        codeValue: '',
        codeFile: null,
        options: {},
        showTitle: true
    }

    constructor(props) {
        super(props);

        this.state = {
            code : props.codeValue
        }
    }

    componentDidMount() {
        const { codeFile } = this.props;
        if (codeFile) {
            fetch(codeFile)
            .then(res => res.text())
            .then(text => {
                this.setState({
                    code: text
                })
            })
        }
    }

    render() {
        const { 
            title,
            options,
            showTitle
        } = this.props;

        const codeMirrorOptions = {
            lineNumbers: true,
            theme: 'material',
            mode: {name: 'text/xml'},
            readOnly: true,
            ...options
        }

        if (!showTitle) {
            return <CodeMirror ref="codeMirror" options={codeMirrorOptions} value={this.state.code}/>;
        }

        return (
            <Card title={title} bordered={false}>
                <CodeMirror ref="codeMirror" options={codeMirrorOptions} value={this.state.code}/>
            </Card>
        )
    }
}

export default XmlCodeView;