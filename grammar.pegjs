Timesheet
	= Day ('\n' Day)* { return text()}
Day
	= d:Num _ start:Time e:End*	{ return text()}
    / _
Time
	= h:Num ":" m:Minutes { return `${h}:${m}`}
End
	= "-" l:Label "-" end:Time  {return text()}
Label
    = [^(]+[(]SubEntries[)] {return text()}
	/ [^-]+	{return text()}
SubEntries 
	= SubEntry ([,;] _ SubEntry)* {return text()}
SubEntry
	= start:Time _ label:[^,;)]+ {return {start,label}}
String
	= .*	{return text()}
Num "number"
	= [0-9]+ { return parseInt(text(), 10); }
Minutes "minutes"
	= [0-5][0-9] { return parseInt(text(), 10); }
_ "whitespace"
	= [ \t\n\r]*