# lulu

Webapp for processing a custom timesheet DSL. 
The result is a summary of all the mentioned entries.

## Motivation 
My usual workflow consist of switching back and forth between separately billable projects. 
The way I came to tackle the billing is to write down the time when I switch and to what. 
Sometimes I need to write or modify this information after the fact. 
Initially I was writing this down in a text file backed on Dropbox. 
At the end of the billing period I needed to spend some time calculating the actual time 
spend on each project by adding differences betting end and start times. 
This project came out to be to automate this process.


## DSL Example
The following text:
```
05	8:15-project1-(0:30 project2)-12:00--13:00-project1-16:00
06	8:45-project2-12:30
```
produces:

**Total: 10:30 (10.50h)**

| Day: 05  | 6:45 | | Day: 06  | 3:45 |
| -------- | ---- |-| -------- | ---- |
| project1 | 6:15 | | project2 | 3:45 |
| project2 | 0:30 | |          |      |

## Implementation

* [Firebase](firebase.google.com) for authentication, storage and sync
* [React](https://facebook.github.io/react/) for UI
* [webpack2](https://webpack.js.org/) for bundling
* [pegjs](https://pegjs.org/) - the parser generator
* [typescript](https://www.typescriptlang.org/) 

## Dev Mode

```
cp public/index.html build/
yarn start
```
Go to http://localhost:8080/build/index.html