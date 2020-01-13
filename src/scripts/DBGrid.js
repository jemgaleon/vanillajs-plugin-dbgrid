(function() {
    // Constructor
    this.DBGrid = function() {
        // Define options defaults
        const defaults = {
            gridName: "",
            allowSorting: false,
            allowPaging: false,
            pageSize: 10,
            firstColumnCheckbox: false,
            cancelSelectOnClick: false,
            width: 700,
            height: 300
        }

        // Create global element references
        this.table = null;
        this.columns = null;
        this.data = null;

        // Create options by extending with the passed in arguments
        this.options = extendDefaults(defaults, arguments[0]);
        if (arguments[0] && typeof arguments[0] === "object") {
          this.events = arguments[0].events;
        }

        // todo best practice not sure if this is okay
        this.create();
    }

    // Public Methods
    DBGrid.prototype = {
        create: function() {
          this.columns = this.getColumns();
          this.data = this.getData();
          this.createTable();
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
          const columns = this.columns;
          const data = this.data;

          const table = document.createElement("table");
          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
        
          // Create thead
          const trHead = this.createTableRow({
            isColumn: true,
            data: columns
          });
        
          // Create tbody
          for(let i = 0; i < data.length; i++) {
            const tr = this.createTableRow({
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

          this.table = table;
        
          return table;
      },
      createTableRow: function(props) {
        const tr = document.createElement("tr");
              
        // Create checkbox
        if (this.options.firstColumnCheckbox) {
          const td = this.createTableData({
            type: "input|checkbox",
            isColumn: props.isColumn
          });

          tr.appendChild(td);
        }
      
        // Create toggle
        if (!props.isColumn && this.options.firstColumnToggle) {
          const img = document.createElement("img");
      
          img.src = "";
          img.setAttribute("altText", "image"); // todo custom implementation
      
          tr.appendChild(img);
        }
      
        // Create row data
        for (let i = 0; i < props.data.length; i++) {
          const td = this.createTableData({
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
          if (!this.options.cancelSelectOnClick) {
            tr.addEventListener("click", this.on.rowClick.bind(this, tr));
          }
        }
      
        return tr;
      },
      createTableData: function(props) {      
        const td = props.isColumn 
          ? document.createElement("th") 
          : document.createElement("td");
        const span = document.createElement("span");
        let value = null;
      
        if (props.hidden) {
          td.className = "hidden";
        }
      
        // todo clean up validations
        if (props.type.indexOf("|") > -1) {
          const element = props.type.split("|")[0];
          const elementType =  props.type.split("|")[1];
          const control = document.createElement(element);
      
          control.setAttribute("type", elementType);
          
          if (elementType === "checkbox") {
            // Attributes
            td.setAttribute("style", "width: 25px;");
      
            // Events
            if (props.isColumn) {              
              control.addEventListener("click", this.on.checkAll.bind(this, control));
            }
            else {
              control.addEventListener("click", this.on.check.bind(this, control));
            }
          }
      
          span.appendChild(control);
        } else {
          if (props.isColumn) {
            value = props.value;
          } else {
            // convert data type
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
      
          span.appendChild(document.createTextNode(value));
        }
        
        td.appendChild(span);
      
        return td;
      },
      on: {
        rowClick: function(sender, event) {
          // user-defined row click event
          if (this.events.rowClick && typeof this.events.rowClick === "function") {
            this.events.rowClick(sender, event);
          }
        },
        checkAll: function(sender, event) {
          const isChecked = sender.checked;
          const checkboxes = this.table.querySelectorAll("tbody input[type=checkbox]");

          checkboxes.forEach(function(checkbox) {
            checkbox.checked = isChecked;
          });
        },
        check: function(sender, event) {
          const checkboxAll = this.table.querySelector("thead input[type=checkbox]");

          if (!sender.checked) {
            checkboxAll.checked = false
          }
          else {
            const checkboxes = this.table.querySelectorAll("tbody input[type=checkbox]");
            let hasUnchecked = false;

            checkboxes.forEach(function(checkbox) {
              if (!checkbox.checked) {
                hasUnchecked = true;
                return false;
              }
            });

            checkboxAll.checked = !hasUnchecked;
          }
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