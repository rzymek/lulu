import * as moment from 'moment';
import { hour } from './utils/utils';
declare function require(path: string): any;
const grammar = require('./grammar.pegjs');

function now(): Time {
    const now = moment();
    return {
        h: now.hour(),
        m: now.minutes(),
    };
}

function processTimesheets(days: ParserOutput[]): TimeSheet[] {
    const minutes = (time) => time.h * 60 + time.m;
    const append = (obj, key, value) => {
        if (obj[key] === undefined) {
            obj[key] = value;
        } else {
            obj[key] += value;
        }
        return obj;
    };
    return days.filter(day =>
        day !== undefined,
    ).map(day => {
        if (day.day === null) {
            // break:
            return {
                day: null,
                entries: [],
                total: null,
                totalMinutes: 0,
            };
        }
        day.ends.reduce((start, entry) => {
            const end = entry.end || now();
            entry.min = minutes(end) - minutes(start);
            return end;
        }, day.start);
        const dayMinutes = day.ends.map(entry => ({
            breaks: entry.label.breaks || [],
            label: entry.label.label,
            min: entry.min,
        })).reduce((result, entry) => {
            let min = entry.min;
            entry.breaks.forEach(subentry => {
                append(result, subentry.label, minutes(subentry.time));
                min -= minutes(subentry.time);
            });
            append(result, entry.label, min);
            return result;
        }, {});
        delete dayMinutes[''];
        let total = 0;
        Object.keys(dayMinutes).forEach(label => {
            total += dayMinutes[label];
            dayMinutes[label] = hour(dayMinutes[label]);
        });
        return {
            day: day.day,
            entries: dayMinutes,
            total: hour(total),
            totalMinutes: total,
        };
    });
}

export function parse(text): TimeSheet[] /* throws TSError */ {
    const days: ParserOutput[] = grammar.parse(text);
    const result = processTimesheets(days);
    return result;
}

export interface TimeSheet {
    day: string;
    total: string;
    totalMinutes: number;
    entries: { [label: string]: string /*h:m*/ };
}
interface PegjsErrorLocation {
    start: number;
    line: number;
    column: number;
}
export interface PegjsError {
    message: string;
    expected: Array<{
        type: string,
        description: string,
    }>;
    found: string;
    location: {
        start: PegjsErrorLocation,
        end: PegjsErrorLocation,
    };
    name: string;
}
interface Time {
    h: number;
    m: number;
}
interface ParserOutput {
    day: string;
    start: Time;
    ends: Array<{
        end: Time,
        label: {
            breaks: Array<{
                label: string,
                time: Time,
            }>,
            label: string,
        },
        min: number,
    }>;
}
