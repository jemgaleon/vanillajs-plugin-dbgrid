(function() {
    // Constructor
    window.DBGrid = function() {
        const grid = this;
        // Define options defaults
        const defaults = {
            gridName: "",
            allowSorting: false,
            allowPaging: false,
            pageSize: 10,
            //firstColumnCheckbox: false, // replace with customFields props
            cancelSelectOnClick: false,
            width: 700,
            height: 300,

            // add these for structure
            events: {
              rowClick: null,
              rowCreated: null
            },
            dataKeyNames: [],
            customFields: [ // support pre-defined controls first
              //{ type: "checkbox", includeInHeader: true, index: 0 },
              //{ type: "toggle", includeInHeader: false, index: 0 }
            ]
        }

        // Create global element references
        grid.table = null;
        grid.columns = null;
        grid.sortList = [];
        grid.data = null;

        // Create options by extending with the passed in arguments
        grid.options = extendDefaults(defaults, arguments[0]);
        if (arguments[0] && typeof arguments[0] === "object") {
          grid.events = arguments[0].events;
        }

        // todo best practice not sure if grid is okay
        //grid.parent.classList.add("tblWrapper");
        grid.create();
    }

    // Public Methods
    DBGrid.prototype = {
        create: function() {
          const grid = this;

          grid.columns = grid.getColumns();
          grid.data = grid.getData();
          grid.createTable();
        },
        getColumns: function() {
          // todo web api call
          // note data key name, if dbgrid.dataKeyNames found in the fields, add dataKeyName props to data
          return [
            { value: "Exam Key", type: "number", hidden: true, dataKeyName: "examKey" },
            { value: "Case Key", type: "number", hidden: true, dataKeyName: "caseKey" },
            { value: "Section", type: "string", dataKeyName: "section" },
            { value: "Priority", type: "string", dataKeyName: "priority" },
            { value: "Lab #", type: "string" },
            { value: "Date Assigned", type: "date" },
            { value: "Due Date", type: "date" },
            { value: "Status", type: "string" },
            { value: "Complaint Number", type: "string" },
            { value: "Items", type: "string" }
          ]
        },
        getData: function () {
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

          const columns = grid.columns;
          const data = grid.data;

          const table = document.createElement("table");
          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
        
          // Create thead
          const trHead = grid.createTableRow({
            isColumn: true,
            data: columns
          });
        
          // Create tbody
          for(let i = 0; i < data.length; i++) {
            const tr = grid.createTableRow({
              isColumn: false,
              data: data[i].map(function(row, index) {
                return {
                  value: row,
                  type: columns[index].type,
                  hidden: columns[index].hidden,
                  dataKeyName: columns[index].dataKeyName
                }
              }, [])
            });
        
            tbody.appendChild(tr);
          }
        
          thead.appendChild(trHead);
          table.appendChild(thead);
          table.appendChild(tbody);

          grid.table = table;
        
          return table;
      },
      createTableRow: function(props) {
        const grid = this;

        const tr = document.createElement("tr");
              
        // todo make customFields dynamic
        // Create custom fields
        //if (grid.options.firstColumnCheckbox) {
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
                  type: "input|type=checkbox",
                  isColumn: props.isColumn
                };
              }
              else {
                properties = {
                  value: "",
                  isColumn: props.isColumn
                };
              }

              td = grid.createTableData(properties);
            }
            
            tr.appendChild(td);
          });
        }
      
        // // todo Create toggle
        // if (!props.isColumn && grid.options.firstColumnToggle) {
        //   const img = document.createElement("img");
      
        //   img.src = "";
      
        //   tr.appendChild(img);
        // }
      
        // Create row data
        for (let i = 0; i < props.data.length; i++) {
          const td = grid.createTableData({
            index: i,
            value: props.data[i].value,
            type: props.data[i].type,
            hidden: props.data[i].hidden,
            isColumn: props.isColumn
          });

          // Data Key
          if (!props.isColumn
            && props.data[i].dataKeyName) {
            tr.dataset[props.data[i].dataKeyName] = props.data[i].value;
          }
      
          tr.appendChild(td);
        }
      
        // Events
        if (!props.isColumn) {
          if (!grid.options.cancelSelectOnClick) {
            tr.addEventListener("click", grid.on.rowClick.bind(grid, tr));
          }
        }

        return tr;
      },
      createTableData: function(props) {   
        const grid = this;

        const td = props.isColumn 
          ? document.createElement("th") 
          : document.createElement("td");
        const span = document.createElement("span");
        let value = null;
      
        // Class
        if (props.hidden) {
          td.classList.add("hidden");
        }
      
        // todo clean up validations
        // Custom field
        if (props.type 
          && props.type.indexOf("|") > -1) {
          const element = props.type.split("|")[0];
          const attributes =  props.type.split("|")[1];
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
      
          span.appendChild(control);
        } else {
          // Set value
          if (props.isColumn) {
            value = props.value;
          } else {
            // Convert to data type
            if (props.type === "date") {
              value =
                props.value !== ""
                  ? new Date(props.value).toLocaleDateString()
                  : props.value;
            } else if (props.type === "number") {
              value = Number(props.value);
            } else {
              value = props.value;
            }
          }

          if (props.isColumn
            && !props.hidden
            && grid.options.allowSorting) {
              // Class
              span.classList.add("sortable");

              // Attributes
              span.sortName = props.index;
              span.sortDirection = -1;
              //span.setAttribute("sort-name", props.index);
              //span.setAttribute("sort-direction", "");
              
              // Event
              span.addEventListener("click", grid.on.sort.bind(grid, span));
          }
      
          span.appendChild(document.createTextNode(value));
        }
        
        td.appendChild(span);
      
        return td;
      },
      on: {
        sort: function(sender, event) {
          const grid = this;

          // Update sort direction { 0: NONE, 1: ASC, 2: DESC}
          sender.sortDirection = sender.sortDirection < 1
            ? ++sender.sortDirection
            : -1;
          //console.log(sender.sortDirection);
          // Add to sort list
          if (sender.sortDirection == 0) {
            grid.sortList.push(sender.sortName);
          }
          else if (sender.sortDirection < 0) {
            let index = grid.sortList.indexOf(sender.sortName);

            grid.sortList.splice(index, 1);
          }

          // Multiple sort by sort list - todo future implementations
          //console.log(grid.sortList);

          // Single Sort - todo check sort algo
          const rows = grid.table.querySelectorAll("tbody tr");

          //console.log(rows);
        },
        rowClick: function(sender, event) {
          const grid = this;

          // Do default behavior first
          
          // Call user-defined row click event
          if (grid.events.rowClick 
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