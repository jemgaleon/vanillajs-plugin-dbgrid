# DBGrid Plugin

A simple grid maker javascript plugin. Basically, I'm trying to  somehow implement the .NET GridView control to JavaScript because I need this at work.

Todo(s):
- [ ] Fetch data web api
- [ ] Fetch data (paging and sorting feature) stored procedure
- [ ] Sorting web api 
- [ ] Sorting stored procedure
- [ ] AllowSorting
- [ ] AllowPaging/PageSize
- [ ] SelectedIndex
- [ ] PageIndex
- [x] Toggle feature
- [x] DataKeyNames

Issue(s):
- [ ] Toggle issue row background nth-child(odd)
- [x] Checkbox click triggers row click

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