Timesheet
	= first:Day next:('\n' Day)* { return [first, ...next.map(v=>v[1]).filter(v=>v)]}
Day
	= day:Num _ start:Time ends:End*	{ return {day,start,ends}}
    / _									{ return undefined} 
Time
	= h:Num ":" m:Minutes { return {h,m}}
End
	= "-" label:Label "-" end:Time  {return {label,end}}
Label
    = label:[^-]+ "-" [(]breaks:SubEntries[)] {return {label:label.join(''), breaks}}
	/ [^-(]+	{return {label:text()}}
	
SubEntries 
	= first:SubEntry next:([,;] _ SubEntry)* { return [first, ...next.map(v => v[2])] }
SubEntry
	= start:Time _ label:[^,;)]+ {return {start,label: label.join('')}}
String
	= .*	{return text()}
Num "number"
	= [0-9]+ { return parseInt(text(), 10); }
Minutes "minutes"
	= [0-5][0-9] { return parseInt(text(), 10); }
_ "whitespace"
	= [ \t\n\r]*