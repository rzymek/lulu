import * as moment from 'moment';
import {hour} from './utils/utils';
declare function require(path: string): any;
const grammar = require('./grammar.pegjs');

export interface TimeSheet {
    day: any;
    total: string;
    totalMinutes: number;
    entries: any;
}
export interface TSError {
}

function now() {
    let now = moment();
    return {
        h: now.hour(),
        m: now.minutes(),
    };
}

function processTimesheets(days: any[]): TimeSheet[] {
    const minutes = (time) => time.h * 60 + time.m;
    const append = (obj, key, value) => {
        if (obj[key] === undefined) {
            obj[key] = value;
        } else {
            obj[key] += value;
        }
        return obj;
    };
    return days.filter(day => day).map(day => {
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
            totalMinutes: total
        };
    });
}

export function parse(text): TimeSheet[] /* throws TSError */ {
    const days = grammar.parse(text);
    const result = processTimesheets(days);
    return result;
}
