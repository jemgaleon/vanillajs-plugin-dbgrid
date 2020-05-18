# GridView Javascript Plugin

A JavaScript implementation of the .NET GridView control.

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
