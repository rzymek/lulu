import * as React from 'react';
import './App.css';
import { parse } from "./parser";
import * as debounce from "lodash.debounce";
import * as _ from "lodash";

export class Results extends React.Component<{ value: string }, {}> {
  render() {
    try {
      return <div>
        {parse(this.props.value).map((day, idx) => <table key={idx}>
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
      </div>;
    } catch (error) {
      return <div>{JSON.stringify(error)}</div>
    }
  }
}