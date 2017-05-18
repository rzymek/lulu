import * as _ from 'lodash';
import * as React from 'react';
import { TimeSheet } from '../parser';
import { hour, toMinutes } from '../utils/utils';
import './App.css';

const EntriesRows = (entries: {}, className?: string) => _(entries)
  .toPairs()
  .map(pair => ({ label: pair[0], time: pair[1] }))
  .sortBy('label')
  .map(e =>
    <tr key={`${e.label}`} className={className}>
      <th>{e.label}</th>
      <td>{e.time}</td>
    </tr>)
  .value()

export class Results extends React.Component<{ value: TimeSheet[] }, {}> {
  public render() {
    const total = _(this.props.value).map(day => day.totalMinutes).sum();
    const sublabelsTotal = _.chain(this.props.value)
      .filter(day => day.day !== null)
      .map(day => day.sublabels)
      .map(sub => _.mapValues(sub, toMinutes))
      .reduce((result, item) =>
        _.assignWith(result, item, (a, b) => _.defaultTo(a, 0) + _.defaultTo(b, 0))
      , {})
      .mapValues(hour)
      .value();
    return <div>
      <h1 style={{ fontSize: 16 }}>
        Total: {hour(total)}({(total / 60).toFixed(2)}h)
      </h1>
      {!_.isEmpty(sublabelsTotal) && <table>
        <tbody>
          <tr>
              <th colSpan={2}>Sublabels</th>
            </tr>
          {EntriesRows(sublabelsTotal)}
        </tbody>
      </table>}
      {this.props.value.map((day, idx) => day.day === null
        ? <hr />
        : <table key={idx}>
          <tbody >
            <tr>
              <th>Day: {day.day}</th>
              <th>{day.total}</th>
            </tr>
            {EntriesRows(day.entries)}
            {EntriesRows(day.sublabels, "sublabel")}
          </tbody>
        </table>)}
    </div>;
  }
}
