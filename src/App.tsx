import * as React from 'react';
import './App.css';
import { Results } from "./Results";
import * as debounce from "lodash.debounce";
import * as _ from "lodash";

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

  componentDidMount() {
    setInterval(this.forceUpdate.bind(this), 10 * 1000);
  }

  handleChange(e) {
    const {value} = e.target;
    this.updateState(value);
    this.persist(value);
  }
  render() {
    return <div>
      <textarea rows={20}
        style={{ width: '100%' }}
        defaultValue={this.state.value}
        onChange={this.handleChange.bind(this)}>
      </textarea>
      <Results value={this.state.value}/>
    </div>;
  }
}

export default App;
