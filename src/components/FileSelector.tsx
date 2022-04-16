import * as React from 'react';

export class FileSelector extends React.Component<{
    values: string[],
    value: string,
    onChange(value: string): void,
}, {}> {

    public render() {
        return <select onChange={this.handleChange.bind(this)} value={this.props.value}>
            {this.props.values.map(v =>
                <option key={v} value={v}>{v}</option>,
            )}
        </select>;
    }

    private handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.props.onChange(e.target.value);
    }
}
