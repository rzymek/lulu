import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as React from 'react';
import * as tabOverride from 'taboverride';
import { parse, TimeSheet, TSError } from '../parser';
import { roundTo5 } from '../utils/utils';
import './App.css';
import { Results } from './Results';

export class TSInput extends React.Component<{
    style?: React.CSSProperties,
    onChange(text: string, result: TimeSheet[]): void,
    onError(error: TSError): void,
}, {}> {
    private textarea: HTMLTextAreaElement;

    public setText(text: string): void {
        this.textarea.value = text;
        this.processText(text); // TODO: maybe unnessesary
    }

    public render() {
        return <textarea rows={20}
            ref={textarea => this.textarea = textarea}
            style={this.props.style}
            onChange={this.handleChange.bind(this)}>
        </textarea>;
    }

    private componentDidMount() {
        tabOverride.set(this.textarea);
        // recalculate now()
        setInterval(this.forceUpdate.bind(this), 10 /*sec*/ * 1000);
    }

    private handleChange(e) {
        const {value} = e.target;
        this.processText(value);
    }

    private processText(text: string) {
        try {
            const result = parse(text);
            this.props.onChange(text, result);
        } catch (error) {
            this.props.onError(error);
        }

    }
}
