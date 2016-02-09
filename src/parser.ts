import * as moment from "moment";
declare function require(path: string): any;
const grammar = require('./grammar.pegjs');

function now() {
    var now = moment();
    return {
        h: now.hour(),
        m: now.minutes()
    }
}


function processTimesheets(days) {
    const pad = (m) => m < 10 ? '0' + m : m;
    const hour = (minutes) => Math.floor(minutes / 60) + ':' + pad(minutes % 60);
    const minutes = (time) => time.h * 60 + time.m;
    const append = (obj, key, value) => {
        if (obj[key] === undefined) {
            obj[key] = value;
        } else {
            obj[key] += value;
        }
        return obj;
    }
    return days.filter(day => day).map(day => {
        day.ends.reduce((start, entry) => {
            const end = entry.end || now()
            entry.min = minutes(end) - minutes(start);
            return end
        }, day.start);
        const dayMinutes = day.ends.map(entry => ({
            label: entry.label.label,
            breaks: entry.label.breaks || [],
            min: entry.min
        })).reduce((result, entry) => {
            let min = entry.min;
            entry.breaks.forEach(subentry => {
                append(result, subentry.label, minutes(subentry.time));
                min -= minutes(subentry.time)
            })
            append(result, entry.label, min);
            return result;
        }, {});
        delete dayMinutes[''];
        let total = 0;
        Object.keys(dayMinutes).forEach(label => {
            total += dayMinutes[label];
            dayMinutes[label] = hour(dayMinutes[label]);
        })
        return {
            entries: dayMinutes,
            day: day.day,
            total: hour(total)
        };
    })
}


export function parse(text) {
    const days = grammar.parse(text);
    console.log(days);
    return processTimesheets(days);
}