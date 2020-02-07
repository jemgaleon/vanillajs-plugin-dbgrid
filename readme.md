# GridView Javascript Plugin

A simple JavaScript implementation of the .NET GridView control (and some of our GridView custom control).

Todo(s):
- [ ] Support for client-side data rendering
- [ ] Programmatically set grid.options.dataKeyNames for client-side 
- [x] Fetch data web api (paging and sorting feature)
- [x] AllowSorting
- [x] AllowPaging/PageSize
- [x] SelectedIndex
- [x] AllowSorting
- [x] AllowPaging
- [x] PageSize
- [x] PagerCount
- [x] Toggle feature
- [x] DataKeyNames
- [x] Grid user settings from database support (records per page, uses scrollbar, grid width, grid height, field names, sql string)

Issue(s):
- [ ] Toggle issue row background nth-child(odd)
- [ ] IE tbody scroll


Usage:
```javascript
// for client-side data rendering
const dbgrid = new DBGrid({
    wrapper: "#grdClient",
    dataKeyNames: "ID",
    columns: [
        { type: "checkbox", hideColumn: false, autoCheck: false },
        { fieldName: "ID", fieldHeader: "Key", fieldWidth: 100, displayOrder: 1, hideField: true, isDataKeyField: true },
        { fieldName: "SEQUENCE", fieldHeader: "Sequence", fieldWidth: 90, displayOrder: 2, hideField: false, isDataKeyField: false },
        { fieldName: "ITEM_DESC", fieldHeader: "Description", fieldWidth: 120, displayOrder: 3, hideField: false, isDataKeyField: false }
    ],
    rowData: [
        [1, 1, "Item A"],
        [2, 2, "Item B"],
        [3, 3, "Item C"],
        [4, 4, "Item D"],
        [5, 5, "Item E"],
        [6, 5, "Item E"]
    ],
    events: {
        rowClick: function(sender, event) {
            // add a row click event handler
        }
    }
});
```
