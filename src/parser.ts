import moment from 'moment';
import { hour } from './utils/utils';
declare function require(path: string): any;
const grammar = require('./grammar.pegjs');

function now(): Time {
    const noww = moment();
    return {
        h: noww.hour(),
        m: noww.minutes(),
    };
}

function part(s: string, nr: number): string {
    const parts = s.split('|');
    return parts[nr];
}

const minutes = (time: { h: number, m: number }) => time.h * 60 + time.m;
const append = (obj: Record<string, number | string>, key: string, value: number) => {
    if (obj[key] === undefined) {
        obj[key] = value;
    } else {
        (obj[key] as number) += value;
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
    }, {} as Record<string, number | string>);
    delete dayMinutes[''];
    let total = 0;
    Object.keys(dayMinutes).forEach(label => {
        total += dayMinutes[label] as number;
        dayMinutes[label] = hour(dayMinutes[label] as number);
    });
    return {
        dayMinutes: dayMinutes as StringMap,
        total,
    };
}

function getSublabelsSumary(day: ParserOutput): { [label: string]: string /*h:m*/ } {
    const { dayMinutes } = processDay(day, 1);
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
        const { dayMinutes, total } = processDay(day);
        return {
            day: day.day,
            entries: dayMinutes,
            sublabels: getSublabelsSumary(day),
            total: hour(total),
            totalMinutes: total,
        };
    });
}

export function parse(text: string): TimeSheet[] /* throws TSError */ {
    const days: ParserOutput[] = grammar.parse(text);
    const result = processTimesheets(days);
    return result;
}

interface StringMap {
    [label: string]: string /*h:m*/;
}
export interface TimeSheet {
    day: string | null;
    total: string | null;
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
    expected: {
        type: string,
        description: string,
    }[];
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
    ends: {
        end: Time,
        label: {
            breaks: {
                label: string,
                time: Time,
            }[],
            label: string,
        },
        min: number,
    }[];
}
