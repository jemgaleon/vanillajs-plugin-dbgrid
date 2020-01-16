# DBGrid Plugin

A simple grid maker javascript plugin. Basically, I'm trying to  somehow implement the .NET GridView control to JavaScript because I need this at work.

Todo(s):
- [ ] fetch data web api
- [ ] fetch data (paging and sorting feature) stored procedure
- [ ] sorting web api 
- [ ] sorting stored procedure
- [ ] AllowSorting
- [ ] AllowPaging/PageSize
- [ ] SelectedIndex
- [ ] PageIndex
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