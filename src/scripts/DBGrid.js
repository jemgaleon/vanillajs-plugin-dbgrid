(function() {
    // Constructor
    window.DBGrid = function() {
        const grid = this;
        // Define options defaults
        const defaults = {
            gridName: "",
            allowSorting: true,
            allowPaging: true,
            pageSize: 10,
            cancelSelectOnClick: false,
            width: 700,
            height: 300,

            // Add these for structure
            events: {
              sort: null,
              rowClick: null,
              rowCreated: null,
              checkAll: null,
              check: null
            },
            dataKeyNames: [],
            customFields: [
              // Support pre-defined controls first
              { type: "", includeInHeader: false, index: 0 }
            ]
        }

        // Create global element references
        grid.table = null;
        grid.columns = null;
        grid.sortList = [];
        grid.rowData = null;
        grid.selectedIndex = null;
        grid.pageIndex = null;

        // Create options by extending with the passed in arguments
        grid.options = extendDefaults(defaults, arguments[0]);
        if (arguments[0] && typeof arguments[0] === "object") {
          grid.events = arguments[0].events;
        }

        grid.init();
        grid.create();
    }

    // Public Methods
    DBGrid.prototype = {
      init: function() {
        const grid = this;

        grid.columns = grid.getColumns();
        grid.rowData = grid.getRowData();
      },
      create: function() {
        const grid = this;

        grid.createTable();
        grid.createTableHead();
        grid.createTableBody();
      },
      getColumns: function() {
        // todo web api call
        return [
          { text: "Exam Key", value: "EXAM_KEY", type: "number", hidden: true, dataKey: true },
          { text: "Case Key", value: "CASE_KEY", type: "number", hidden: true, dataKey: true },
          { text: "Section", value: "SECTION", type: "string", dataKey: true },
          { text: "Priority", value: "PRIORITY", type: "string", dataKey: true },
          { text: "Lab #", value: "LAB_NUMBER", type: "string" },
          { text: "Date Assigned", value: "DATE_ASSIGNED", type: "date" },
          { text: "Due Date", value: "DUE_DATE", type: "date" },
          { text: "Status", value: "STATUS", type: "string" },
          { text: "Complaint Number", value: "COMPLAINT NUMBER", type: "string" },
          { text: "Items", value: "ITEMS", type: "string" }
        ]
      },
      getRowData: function () {
        // todo web api call
        return [
          [1,1,"FA","Normal","2009-0003","","","Ready For Review","2009-000-1234",""],
          [2,1,"CS","Normal","2009-0003","01/01/2020","01/01/2020","Draft Printed","2009-000-114","1,2"],
          [3,1,"CSAS","High","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
          [4,1,"CSAS","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
          [5,1,"BAC","Low","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
          [6,1,"BIO","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
          [7,1,"CSAS","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"]
        ];
      },
      createTable: function() {        
          const grid = this;
          const table = document.createElement("table");

          grid.table = table;

          return table;
      },
      createTableHead: function() {
        const grid = this;
        const thead = document.createElement("thead");
        const rowData = grid.columns.map(function(column, index) {
          return {
            cellValue: column.text,
            type: column.type,
            hidden: column.hidden,
            dataKeyName: column.dataKey ? column.value : "",
            sortName: column.value
          }
        }, []);
        const trHead = grid.createTableRow({
          isColumn: true,
          rowData: rowData
        });

        thead.appendChild(trHead);
        grid.table.appendChild(thead);

        return thead;
      },
      createTableBody: function() {
        const grid = this;
        const tbody = document.createElement("tbody");       
        
        // Create tbody
        for(let i = 0; i < grid.rowData.length; i++) {
          const rowData =  grid.rowData[i].map(function(cell, index) {
            return {
              cellValue: cell,
              type: grid.columns[index].type,
              hidden: grid.columns[index].hidden,
              dataKeyName: grid.columns[index].dataKey ? grid.columns[index].value : ""
            }
          }, []);
          const tr = grid.createTableRow({
            rowData: rowData
          });
      
          tbody.appendChild(tr);
        }

        grid.table.appendChild(tbody);

        return tbody;
      },
      createTableFoot: function() {
        const grid = this;
        
      },
      createTableRow: function(props) {
        const grid = this;
        const tr = document.createElement("tr");

        // Create custom row data
        if (grid.options.customFields.length > 0) {
          let customFields = grid.options.customFields;

          customFields.forEach(function(customField, index) {
            let td = null;
            let properties = {};
            
            // Checkbox
            if (customField.type === "checkbox") {
              if ((props.isColumn && customField.includeInHeader)
                || !props.isColumn) {
                properties = {
                  cellType: "input|type=checkbox",
                  isColumn: props.isColumn
                };
              }
              else {
                properties = {
                  cellValue: "",
                  isColumn: props.isColumn
                };
              }

              td = grid.createTableData(properties);
              tr.appendChild(td);
            }
          });
        }
      
        // Create row data
        for (let i = 0; i < props.rowData.length; i++) {
          const td = grid.createTableData({
            cellIndex: i + Number(grid.options.customFields.length),
            cellValue: props.rowData[i].cellValue,
            cellType: props.rowData[i].type,
            hidden: props.rowData[i].hidden,
            isColumn: props.isColumn,
            sortName: props.isColumn ? props.rowData[i].sortName : ""
          });

          // Add data Key
          if (!props.isColumn
            && props.rowData[i].dataKeyName) {
            const dataKeyName = props.rowData[i].dataKeyName;

            tr.dataset[dataKeyName] = props.rowData[i].cellValue;
          }
      
          tr.appendChild(td);
        }
      
        // Events
        if (!props.isColumn) {
          if (!grid.options.cancelSelectOnClick) {
            tr.addEventListener("click", grid.on.rowClick.bind(grid, tr));
          }

          grid.on.rowCreated.call(grid, tr);
        }

        return tr;
      },
      createTableData: function(props) {   
        const grid = this;

        const td = props.isColumn 
          ? document.createElement("th") 
          : document.createElement("td");
        const span = document.createElement("span");
        let cellValue = null;
      
        // Class
        if (props.hidden) {
          td.classList.add("hidden");
        }
       
        // Custom field
        if (props.cellType
          && props.cellType.indexOf("|") > -1) {
          const control = grid.createCustomControl.call(grid, td, props);

          span.appendChild(control);
        } else {
          // Set value
          if (props.isColumn) {
            cellValue = props.cellValue;
          } else {
            // Convert to data type
            if (props.cellType === "date") {
              cellValue =
                props.cellValue !== ""
                  ? new Date(props.cellValue).toLocaleDateString()
                  : props.cellValue;
            } else if (props.cellType === "number") {
              cellValue = Number(props.cellValue);
            } else {
              cellValue = props.cellValue;
            }
          }

          // Sorting
          if (props.isColumn
            && !props.hidden
            && grid.options.allowSorting) {
              // Class
              span.classList.add("sortable");
              
              // Attributes
              span.sortName = props.sortName;
              span.sortDirection = "";
              
              // Event
              span.addEventListener("click", grid.on.sort.bind(grid, span));
          }
      
          span.appendChild(document.createTextNode(cellValue));
        }
        
        td.appendChild(span);
      
        return td;
      },
      createCustomControl: function(td, props) {
        const grid = this;
        const element = props.cellType.split("|")[0];
        const attributes =  String(props.cellType.split("|")[1]);
        const control = document.createElement(element);
        let elementType = "";

        // Set attributes dynamically
        attributes.split(",").forEach(function(attribute, index) {
          const attrName = attribute.split("=")[0];
          const attrValue = attribute.split("=")[1];

          control.setAttribute(attrName, attrValue);

          if (attrName == "type") {
            elementType = attrValue;
          }
        });
          
        // Checkbox
        if (elementType === "checkbox") {
          // Class
          td.classList.add("checkbox");
    
          // Events
          if (props.isColumn) {              
            control.addEventListener("click", grid.on.checkAll.bind(grid, control));
          }
          else {
            control.addEventListener("click", grid.on.check.bind(grid, control));
          }
        }
        
        return control;
      },
      on: {
        sort: function(sender, event) {
          const grid = this;

          // Sort list and direction
          if (sender.sortDirection === "") {
            sender.sortDirection = "ASC";
            grid.sortList.push(sender.sortName + " " + sender.sortDirection);
          }
          else if (sender.sortDirection === "ASC") {
            let index = grid.sortList.indexOf(sender.sortName + " " + sender.sortDirection);
            
            sender.sortDirection = "DESC";
            grid.sortList.splice(index, 1, sender.sortName + " " + sender.sortDirection);
          }
          else if (sender.sortDirection === "DESC") {
            let index = grid.sortList.indexOf(sender.sortName + " " + sender.sortDirection);
            grid.sortList.splice(index, 1);

            sender.sortDirection = "";
          }

          console.log(grid.sortList);

          // todo web service for sorting
        },
        rowCreated: function(sender, event) {
          const grid = this;
          
          if (grid.events.rowCreated
            && typeof grid.events.rowCreated === "function") {
              grid.events.rowCreated(sender, event);
          }
        },
        rowClick: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const row = grid.table.querySelectorAll(".selected");
          
          if(row.length) {
            row[0].classList.remove("selected");
          }
          sender.classList.add("selected");
          
          // Call user-defined row click event
          if (!grid.options.cancelSelectOnClick
            && grid.events.rowClick 
            && typeof grid.events.rowClick === "function") {
            grid.events.rowClick(sender, event);
          }
        },
        checkAll: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const isChecked = sender.checked;
          const checkboxes = grid.table.querySelectorAll("tbody input[type=checkbox]");

          checkboxes.forEach(function(checkbox) {
            checkbox.checked = isChecked;
          });

          // Call user-defined check all event
          if (grid.events.checkAll
            && typeof grid.events.checkAll === "function") {
            grid.events.checkAll(sender, event);
          }
        },
        check: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const checkboxAll = grid.table.querySelector("thead input[type=checkbox]");

          if (!sender.checked) {
            checkboxAll.checked = false
          }
          else {
            const checkboxes = grid.table.querySelectorAll("tbody input[type=checkbox]");
            let hasUnchecked = false;

            checkboxes.forEach(function(checkbox) {
              if (!checkbox.checked) {
                hasUnchecked = true;
                return false;
              }
            });

            checkboxAll.checked = !hasUnchecked;
          }

          // Call user-defined check event
          if (grid.events.check 
            && typeof grid.events.check === "function") {
            grid.events.check(sender, event);
          }
          
          event.stopPropagation();
        }
      }
    };

    // Private Methods
    function extendDefaults(source, properties) {
      for (let property in properties) {
          if (properties.hasOwnProperty(property) 
            && property != "events") { // exclude events
              source[property] = properties[property];
          }
      }

      return source;
    }
}());