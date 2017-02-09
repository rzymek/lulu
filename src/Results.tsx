import * as React from 'react';
import './App.css';
import * as _ from "lodash";

export class Results extends React.Component<{ value: any[] }, {}> {
  render() {
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
  }
}