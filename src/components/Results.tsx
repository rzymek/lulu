import * as _ from 'lodash';
import * as React from 'react';
import { TimeSheet } from '../parser';
import { hour } from '../utils/utils';
import './App.css';

export class Results extends React.Component<{ value: TimeSheet[] }, {}> {
  public render() {
    const total = _(this.props.value).map(day => day.totalMinutes).sum();
    return <div>
      <h1 style={{ fontSize: 16 }}>
        Total: {hour(total)}({(total / 60).toFixed(2)}min)
      </h1>
      {this.props.value.map((day, idx) => <table key={idx}>
        <tbody >
          <tr>
            <th>Day: {day.day}</th>
            <th>{day.total}</th>
          </tr>
          {_(day.entries)
            .toPairs()
            .map(pair => ({ label: pair[0], time: pair[1] }))
            .sortBy('label')
            .map(e =>
              <tr key={`${e.label}`}>
                <th>{e.label}</th>
                <td>{e.time}</td>
              </tr>)
            .value()
          }
        </tbody>
      </table>)}
    </div>;
  }
}
