import * as _ from 'lodash';
import * as React from 'react';
import {TimeSheet} from '../parser';
import {hour, toMinutes} from '../utils/utils';
import './App.css';

const EntriesRows = (entries: {}, className?: string) => _(entries)
    .toPairs()
    .map(pair => ({label: pair[0], time: pair[1]}))
    .sortBy('label')
    .map(e =>
        <tr key={`${e.label}`} className={className}>
            <th>{e.label}</th>
            <td>{e.time}</td>
        </tr>)
    .value();

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
        const weeks = this.getWeeks();
        const totalLabels = _.chain(this.props.value)
            .flatMap(it => _.toPairs(it.entries))
            .map(([name, time]) => ({name, minutes: toMinutes(time)}))
            .reduce((result, item) => ({
                ...result,
                [item.name]: _.defaultTo(result[item.name], 0) + item.minutes,
            }), {})
            .mapValues(hour)
            .value();

        return <div>
            <h1 style={{fontSize: 16}}>
                Total: {hour(total)}({(total / 60).toFixed(2)}h)
            </h1>
            {weeks.map((week, idx) => <div key={idx} className="week">
                {week.map((day, key) => <table key={key}>
                    <tbody>
                    <tr>
                        <th>Day: {day.day}</th>
                        <th>{day.total}</th>
                    </tr>
                    {EntriesRows(day.entries)}
                    {EntriesRows(day.sublabels, 'sublabel')}
                    </tbody>
                </table>)}
            </div>)}
            <div style={{clear: 'left'}}/>
            <table>
                <tbody>
                <tr>
                    <th colSpan={2}>Totals</th>
                </tr>
                {EntriesRows(totalLabels)}
                </tbody>
            </table>
            {!_.isEmpty(sublabelsTotal) && <table>
                <tbody>
                <tr>
                    <th colSpan={2}>Sublabels</th>
                </tr>
                {EntriesRows(sublabelsTotal)}
                </tbody>
            </table>}
        </div>;
    }

    private getWeeks() {
        let group = 0;
        return _(this.props.value).groupBy(v => {
            if (v.day == null) {
                group++;
                return null;
            } else {
                return group;
            }
        }).omit('null').values().reverse().value();
    }
}
