import * as React from 'react';
import './App.css';
import { parse } from "./parser";
import * as debounce from "lodash.debounce";

class App extends React.Component<{}, { value: string }> {
  updateState: (value: string) => void;
  persist: (value: string) => void;

  constructor() {
    super();
    this.state = {
      value: localStorage.getItem('value')
    }
    this.updateState = debounce(value => this.setState({ value }), 100);
    this.persist = debounce(value => localStorage.setItem("value", value), 1000);
  }

  handleChange(e) {
    const {value} = e.target;
    this.updateState(value);
    this.persist(value);
  }
  render() {
    return <div>
      <textarea rows={30}
        style={{ width: '48%' }}
        defaultValue={this.state.value}
        onChange={this.handleChange.bind(this)}>
      </textarea>
      <pre style={{ width: '48%', float: 'right' }}>
        {JSON.stringify(parse(this.state.value), null, 2)}
      </pre>
    </div>
  }
}

export default App;
