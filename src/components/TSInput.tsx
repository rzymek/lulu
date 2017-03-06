import * as React from 'react';
import * as firebase from "firebase";
import * as _ from "lodash";
import './App.css';
import { Results } from "./Results";
import { parse, TimeSheet, TSError } from "../parser";
import * as tabOverride from "taboverride";
import { roundTo5 } from "../utils/utils";


export class TSInput extends React.Component<{
    onChange(text:string, result: TimeSheet[]): void,
    onError(error: TSError): void,
    style?: React.CSSProperties
}, {}> {

    componentDidMount() {
        tabOverride.set(this.refs['textarea']);
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
    setText(text: string): void {
        const textarea = this.refs['textarea'] as HTMLTextAreaElement;
        textarea.value = text;
        this.processText(text);//TODO: maybe unnessesary
    }

    render() {
        return <textarea rows={20}
            ref="textarea"
            style={this.props.style}
            onChange={this.handleChange.bind(this)}>
        </textarea>
    }
}