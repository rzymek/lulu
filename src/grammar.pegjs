
Timesheet
	= first:Day next:("\n" _ Day)* { return [first, ...next.map(v=>v[2]).filter(v=>v)]}
Day
	= day:[^ \t]+ _ start:Time ends:End*	{ return {day,start,ends}}
    / _									    { return undefined } 
Time
	= h:Num ":" m:Minutes { return {h,m}}
End
	= "-" label:Label "-" end:Time?  {return {label,end}}
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