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

function part(s: string, nr: number): string {
    const parts = s.split('|');
    return parts[nr];
}

const minutes = (time) => time.h * 60 + time.m;
const append = (obj, key, value) => {
    if (obj[key] === undefined) {
        obj[key] = value;
    } else {
        obj[key] += value;
    }
    return obj;
};

function processDay(day: ParserOutput, labelPart: number = 0): {
    dayMinutes: StringMap;
    total: number;
} {
    const dayMinutes = day.ends.map(entry => ({
        breaks: entry.label.breaks || [],
        label: part(entry.label.label, labelPart),
        min: entry.min,
    })).reduce((result, entry) => {
        let min = entry.min;
        entry.breaks.forEach(subentry => {
            append(
                result,
                part(subentry.label, labelPart),
                minutes(subentry.time),
            );
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
        dayMinutes,
        total,
    };
}

function getSublabelsSumary(day: ParserOutput): { [label: string]: string /*h:m*/ } {
    const {dayMinutes} = processDay(day, 1);
    delete dayMinutes['undefined'];
    return dayMinutes;
}

function processTimesheets(days: ParserOutput[]): TimeSheet[] {
    return days.filter(day =>
        day !== undefined,
    ).map(day => {
        if (day.day === null) {
            // break:
            return {
                day: null,
                entries: {},
                sublabels: {},
                total: null,
                totalMinutes: 0,
            };
        }
        day.ends.reduce((start, entry) => {
            const end = entry.end || now();
            entry.min = minutes(end) - minutes(start);
            return end;
        }, day.start);
        const {dayMinutes, total} = processDay(day);
        return {
            day: day.day,
            entries: dayMinutes,
            sublabels: getSublabelsSumary(day),
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

interface StringMap {
    [label: string]: string /*h:m*/;
}
export interface TimeSheet {
    day: string;
    total: string;
    totalMinutes: number;
    entries: StringMap;
    sublabels: StringMap;
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
