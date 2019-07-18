import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown/with-html';

class MarkdownView extends PureComponent {
    static defaultProps = {
        sourceValue: '',
        sourceFile: null,
        options: {}
    }

    constructor(props) {
        super(props);

        this.state = {
            source: props.sourceValue
        }
    }

    componentDidMount() {
        const { sourceFile } = this.props;
        if (sourceFile) {
            fetch(sourceFile)
            .then(res => res.text())
            .then(text => {
                this.setState({
                    source: text
                })
            })
        }
    }

    render() {
        const options = {
            escapeHtml: false,
            linkTarget: (url, text, title) => {
                if (url.indexOf('http') === 0) {
                    return '_blank';
                } else {
                    return;
                }
            },
            ...this.props.options
        }

        const {source} = this.state;
        return <div style={{backgroundColor: 'white', padding: 15}}><ReactMarkdown source={source} {...options}/></div>;
    }
}

export default MarkdownView;