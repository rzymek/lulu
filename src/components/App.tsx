import * as React from 'react';
import * as firebase from "firebase";
import * as _ from "lodash";
import * as tabOverride from "taboverride";
import * as moment from "moment";
import './App.css';
import { Results } from "./Results";
import { parse, TimeSheet, TSError } from "../parser";
import { TSInput } from "./TSInput"
import { DB } from "../DB";

export class App extends React.Component<{}, {
  value: any[],
  error: any,
  loggedIn: boolean,
  dirty: boolean
}> {
  private db = new DB<any>();

  constructor() {
    super();
    this.state = {
      value: [],
      error: undefined,
      loggedIn: false,
      dirty: false
    }
  }

  private persist = _.debounce(
    value => this.db.write(value),
    1000,
    { leading: true }
  );

  componentDidMount() {
    tabOverride.set(this.refs['textarea']);

    // recalculate now()
    setInterval(this.forceUpdate.bind(this), 10 * 1000);

    this.db.login()
      .then(() => {
        this.setState({ loggedIn: true })
        this.db.subscribe((value: any) => {
          const input = this.refs['input'] as TSInput;
          input.setText(value);
        })
      });
  }

  handleChange(text: string, value: TimeSheet[]) {
    this.setState({
      dirty: true,
      value,
      error: undefined
    });
    this.persist(text)
      .then(() => this.setState({ dirty: false }))
  }

  handleError(error: TSError) {
    this.setState({
      value: [],
      error
    })
  }

  getStatusColor() {
    if (this.state.error !== undefined) {
      return '#ffdddd';
    } else if (!this.state.loggedIn) {
      return '#dddddd';
    } else if (this.state.dirty) {
      return '#f1f442';
    } else {
      return '#ddffdd';
    }
  }

  render() {
    return <div>
      <TSInput
        ref="input"
        style={{
          width: '100%',
          backgroundColor: this.getStatusColor()
        }}
        onChange={this.handleChange.bind(this)}
        onError={this.handleError.bind(this)} />
      <Results value={this.state.value} />
      <pre>{JSON.stringify(this.state.error, null, 2)}</pre>
    </div>;
  }
}