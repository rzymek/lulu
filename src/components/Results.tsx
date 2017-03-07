import * as _ from 'lodash';
import * as React from 'react';
import { TimeSheet } from '../parser';
import './App.css';

export class Results extends React.Component<{ value: TimeSheet[] }, {}> {
  public render() {
    return <div>
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
