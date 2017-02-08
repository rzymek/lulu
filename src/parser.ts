// declare module "./grammar.pegjs";
declare function require(path:string):any;
const grammar = require('./grammar.pegjs');

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
            entry.min = minutes(entry.end) - minutes(start);
            return entry.end
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
        dayMinutes._day = day.day;
        dayMinutes._total = hour(total);
        return dayMinutes;
    })
}


export function parse(text) {
    try {
        const days = grammar.parse(text);
        return processTimesheets(days);
    } catch (error) {
        return error;
    }
}