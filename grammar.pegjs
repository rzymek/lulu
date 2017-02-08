result = days:Timesheet { 
	const pad = (m) => m < 10 ? '0'+m : m;
	const hour = (minutes) => Math.floor(minutes / 60) +':' + pad(minutes%60);
	const minutes = (time) => time.h*60+time.m;
    const append = (obj, key, value) => {
    	if(obj[key] === undefined) {
        	obj[key] = value;
        }else{
        	obj[key] += value;
        }
        return obj;
    }
	return days.filter(day=>day).map(day => {
    	day.ends.reduce((start,entry) => { 
			entry.min = minutes(entry.end)-minutes(start);
			return entry.end
		}, day.start);
      	const dayMinutes= day.ends.map(entry => ({
        	label: entry.label.label,
            breaks: entry.label.breaks || [],
            min: entry.min
        })).reduce((result,entry)=>{
        	let min=entry.min;
        	entry.breaks.forEach(subentry => {
            	append(result, subentry.label, minutes(subentry.time));
                min -= minutes(subentry.time)
            })
        	append(result, entry.label, min);
	        return result;
    	},{});
        delete dayMinutes[''];
        let total=0;
        Object.keys(dayMinutes).forEach(label => {
            total += dayMinutes[label];
        	dayMinutes[label] = hour(dayMinutes[label]);
        })
        dayMinutes._day = day.day;
        dayMinutes._total = hour(total);
        return dayMinutes;
    })
}

Timesheet
	= first:Day next:("\n" _ Day)* { return [first, ...next.map(v=>v[2]).filter(v=>v)]}
Day
	= day:Num _ start:Time ends:End*	{ return {day,start,ends}}
    / _									{ return undefined } 
Time
	= h:Num ":" m:Minutes { return {h,m}}
End
	= "-" label:Label "-" end:Time  {return {label,end}}
Label
    = label:[^-]+ "-" [(]breaks:SubEntries[)] {return {label:label.join(''), breaks}}
	/ [^-(]*	{return {label:text()}}
	
SubEntries 
	= first:SubEntry next:([,;] _ SubEntry)* { return [first, ...next.map(v => v[2])] }
SubEntry
	= time:Time _ label:[^,;)]+ {return {time,label: label.join('')}}
String
	= .*	{return text()}
Num "number"
	= [0-9]+ { return parseInt(text(), 10); }
Minutes "minutes"
	= [0-5][0-9] { return parseInt(text(), 10); }
_ "whitespace"
	= [ \t\n\r]*
