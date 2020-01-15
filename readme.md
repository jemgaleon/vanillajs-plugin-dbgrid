# DBGrid Plugin

A simple grid maker javascript plugin. Basically, I'm trying to  somehow implement the .NET GridView control to JavaScript because I need this at work.

Todo(s):
- [ ] web api call for data
- [ ] stored procedure for data fetch
- [ ] AllowSorting
- [ ] AllowPaging/PageSize
- [x] DataKeyNames

Issue(s):
- Checkbox click triggers row click

Usage:
```javascript
const dbgrid = new DBGrid({
    firstColumnCheckbox: true,
    cancelSelectOnClick: false,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    events: {
        rowClick: function(sender, event) {
            // add a row click event handler
        }
    }
});

tblWrapper.appendChild(dbgrid);
```

Note:
- Not written in es6 yet
- Do not expose database! 

let tre = dbgrid.table.querySelectorAll("tbody tr td:nth-child(4)");
tre.toArray().sort((x,y) => x.textContent.localeCompare(y.textContent))
let listOfRows = [...tre]
listOfRows.sort((x,y) => x.textContent.localeCompare(y.textContent)).map( x=> x.textContent)
