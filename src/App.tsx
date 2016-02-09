import * as React from 'react';
import './App.css';
import { parse } from "./parser";
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

  handleChange(e) {
    const {value} = e.target;
    this.updateState(value);
    this.persist(value);
  }
  render() {
    const result = parse(this.state.value);
    console.log(result);
    return <div>
      <textarea rows={20}
        style={{ width: '100%' }}
        defaultValue={this.state.value}
        onChange={this.handleChange.bind(this)}>
      </textarea>
      {result.map((day, idx) => <table key={idx}>
        <tbody >
        <tr>
        <th>Day: {day.day}</th>
        <th>{day.total}</th>
        </tr>
          {_(day.entries)
            .toPairs()
            .map(pair => ({ label: pair[0], time: pair[1] }))
            .map((e, idx) =>
              <tr key={idx}>
                <th>{e.label}</th>
                <td>{e.time}</td>
              </tr>)
            .value()
          }
        </tbody>
      </table>)}
    </div>
  }
}

export default App;
