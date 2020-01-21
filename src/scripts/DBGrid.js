(function() {
    // Constructor
    this.DBGrid = function() {
        const grid = this;
        // Define options defaults
        const defaults = {
            wrapper: "",
            gridName: "",
            additionalCriteria: "",
            allowSorting: true,
            allowPaging: false,
            pageSize: 10,
            pagerCount: 10,
            cancelSelectOnClick: false,
            width: 700,
            height: 300,
            serviceURL: {
              getColumns: "",
              getRowData: "",
            }
            
            /* Structure:
            events: {
              created: null,
              sorted: null,
              selectedIndexChanged: null,
              rowCreated: null,
              checkAll: null,
              check: null,
              toggleAll: null,
              toggle: null,
              pageIndexChanged: null
            },
            dataKeyNames: [],
            customFields: [
              // Support pre-defined controls first
              { type: "toggle", hideColumn: true, autoOpen: true },
              { type: "checkbox" }
            ]
            */
        }

        // Create options by extending with the passed in arguments
        grid.options = extendDefaults(defaults, arguments[0]);

        if (arguments[0] && typeof arguments[0] === "object") {
          grid.events = arguments[0].events;
        }

        // Create global element references
        grid.table = null;

        // Data-driven properties
        grid.columns = null;
        grid.rowData = null;
        grid.sortList = [];
        grid.totalRecords = 0;
        grid.selectedPageIndex = 1;
        grid.selectedIndex = -1;

        // Initialization
        grid.init();
        grid.create();

        if (grid.options.wrapper != "") { 
          grid.attach();
        }
    }

    // Public Methods
    DBGrid.prototype = {
      init: function() {
        const grid = this;
        
        grid.columns = grid.getColumns();
        grid.rowData = grid.getRowData();
        grid.totalRecords = grid.getTotalRecords();
      },
      create: function() {
        const grid = this;

        grid.createTable();
        grid.createTableHead();
        grid.createTableBody();

        if (grid.options.allowPaging) {
          grid.createTableFoot();
        }

        grid.on.created.call(grid);
      },
      attach: function() {
        const grid = this;
        const wrapper = document.querySelector(grid.options.wrapper);
        
        if (!grid.options.allowPaging) {
          wrapper.style.maxHeight = grid.options.height + "px";
        }

        wrapper.style.width = grid.options.width + "px";
        wrapper.style.overflow = "auto";
        
        wrapper.appendChild(grid.table);
      },
      getColumns: function() {
        const grid = this;
        
        const params = {
          gridName: grid.options.gridName
        };

        return grid.options.columns || grid.service.getColumns(params);
      },
      getRowData: function () {
        const grid = this;

        const params = {
          gridName: grid.options.gridName,
          pageSize: grid.options.pageSize,
          selectedPageIndex: grid.selectedPageIndex,
          sortList: grid.sortList
        };

        return grid.options.rowData || grid.service.getRowData(params);
      },
      getTotalRecords: function() {
        const grid = this;

        return grid.service.getTotalRecords();
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
            cellValue: column.fieldHeader,
            type: column.fieldType,
            width: column.fieldWidth,
            hidden: column.hideField,
            dataKeyName: column.dataKeyField ? column.fieldName : "",
            sortName: column.fieldName
          }
        }, []);
        const tr = grid.createTableRow({
          isColumn: true,
          rowData: rowData
        });

        thead.appendChild(tr);
        grid.table.appendChild(thead);

        return thead;
      },
      createTableBody: function() {
        const grid = this;
        const tbody = document.createElement("tbody");       

        for(let i = 0; i < grid.rowData.length; i++) {
          const rowData =  grid.rowData[i].map(function(cell, index) {
            return {
              cellValue: cell,
              type: grid.columns[index].fieldType,
              width: grid.columns[index].fieldWidth,
              hidden: grid.columns[index].hideField,
              dataKeyName: grid.columns[index].dataKeyField ? grid.columns[index].fieldName : ""
            }
          }, []);
          const tr = grid.createTableRow({
            isBody: true,
            rowData: rowData
          });
          
          tbody.appendChild(tr);
        }

        if (grid.table.tBodies.length) {
          grid.table.removeChild(grid.table.tBodies[0]);
        }

        grid.table.appendChild(tbody);

        return tbody;
      },
      createTableFoot: function() {
        const grid = this;
        const tfoot = document.createElement("tfoot");
        const rowData = [{
          pageSize: grid.options.pageSize,
          pagerCount: grid.options.pagerCount,
          selectedPageIndex: grid.selectedPageIndex,
          totalRecords: grid.totalRecords
        }];
        const tr = grid.createTableRow({
          isFoot: true,
          rowData: rowData
        });

        tfoot.appendChild(tr);
        grid.table.deleteTFoot();
        grid.table.appendChild(tfoot);

        return tfoot;
      },
      createTableRow: function() {
        const grid = this;
        const props = arguments[0];

        const tr = document.createElement("tr");

        // Create custom row data
        if (!props.isFoot
          && grid.options.customFields.length > 0) {
          const customFields = grid.options.customFields;

          customFields.forEach(function(customField, index) {
            let tableDataProps = {};
            
            // Checkbox
            if (customField.type === "checkbox") {
              tableDataProps = {
                cellType: "input|type=checkbox",
                isColumn: props.isColumn
              };
            }
            // Toggle
            else if (customField.type === "toggle") {
              tableDataProps = {
                cellType: "img|type=toggle,alt=collapse",
                isColumn: props.isColumn,
                autoOpen: customField.autoOpen,
                hideColumn: customField.hideColumn
              };
            }

            const td = grid.createCustomTableData.call(grid, tableDataProps, tr);
            tr.appendChild(td);
          });
        }
      
        // Create row data
        for (let i = 0; i < props.rowData.length; i++) {
          let tableDataProps = {};
          let cellValue = props.rowData[i].cellValue;
          let width = Number(props.rowData[i].width)
            ? Number(props.rowData[i].width) + "px"
            : "50px";

          if (!props.rowData[i].hidden) {
            // Table head
            if (props.isColumn) {
              tableDataProps = {
                cellValue: cellValue,
                sortName: props.rowData[i].sortName
              };
  
              const th = grid.createTableHeadData(tableDataProps);
              th.style.width = width;
              tr.appendChild(th);
            }
            // Table foot
            else if (props.isFoot) {
              tableDataProps = {
                pageSize: props.rowData[i].pageSize,
                pagerCount: props.rowData[i].pagerCount,
                selectedPageIndex: props.rowData[i].selectedPageIndex,
                totalRecords: props.rowData[i].totalRecords
              };

              const th = grid.createTableFootData(tableDataProps);
              tr.appendChild(th);
            }
            // Table body
            else if (props.isBody) {
              tableDataProps = {
                cellValue: cellValue,
                cellType: props.rowData[i].type
              };
  
              const td = grid.createTableData(tableDataProps);
              td.style.width = width;
              tr.appendChild(td);
            }
          }

          // Add data Key
          if (props.isBody
            && props.rowData[i].dataKeyName) {
            const dataKeyName = props.rowData[i].dataKeyName;

            tr.dataset[dataKeyName.toLowerCase()] = cellValue;
          }
        }
      
        // Events
        if (props.isBody) {
          if (!grid.options.cancelSelectOnClick) {
            tr.addEventListener("click", grid.on.selectedIndexChanged.bind(grid, tr));
          }

          grid.on.rowCreated.call(grid, tr);
        }

        return tr;
      },
      createTableHeadData: function() {
        const grid = this;
        const props = arguments[0];

        const th = document.createElement("th") 
        let control = null;
        let textNode = "";

        // Column with sorting
        if (grid.options.allowSorting
          && props.cellValue !== "") {
          control = document.createElement("a");

          // Add class
          control.classList.add("sortable");
          
          // Attributes
          control.setAttribute("sortName", props.sortName);
          control.setAttribute("sortDirection", "");
          
          // Event
          control.addEventListener("click", grid.on.sorted.bind(grid, control));
        }
        else
        {
          control = document.createElement("span");
        }

        textNode = document.createTextNode(grid.utility.parseValue(props.cellValue, props.cellType));
        control.appendChild(textNode);
        th.appendChild(control);

        return th;
      },
      createTableData: function() {
        const grid = this;
        const props = arguments[0];

        const td = document.createElement("td");
        const span = document.createElement("span");
        let textNode = "";

        textNode = document.createTextNode(grid.utility.parseValue(props.cellValue, props.cellType));
        span.appendChild(textNode);
        td.appendChild(span);

        return td;
      },
      createTableFootData: function() {
        const grid = this;
        const props = arguments[0];

        const th = document.createElement("th") 
        const pageGroup = Math.ceil(props.selectedPageIndex / props.pagerCount);
        const totalPages = Math.ceil(props.totalRecords / props.pageSize);

        // console.log({
        //   totalPages: totalPages, // total number of pages (total records divided by page size)
        //   pageSize: props.pageSize, // how may rows per page
        //   pagerCount: props.pagerCount, // how many page number will be visible 
        //   pageGroup: pageGroup, // groupings of page number (group 1: pages 1 to pager count)
        //   selectedPageIndex: props.selectedPageIndex, // current page index
        //   totalRecords: props.totalRecords // total number of records
        // });

        // Add previous paging
        if (pageGroup > 1) {
          const a = document.createElement("a");
          
          a.appendChild(document.createTextNode("..."));

          // Attibute
          a.setAttribute("value", "previous");
          
          // Event
          a.addEventListener("click", grid.on.pageIndexChanged.bind(grid, a));
          
          th.appendChild(a);
        }

        // Add paging
        let startIndex = (pageGroup - 1) * props.pagerCount + 1;
        let endIndex = Math.min(pageGroup * props.pagerCount, totalPages);
        
        // todo - show range if last page totalPage - props.pagerCount
        // if (pageGroup > Math.ceil(totalPages / props.pagerCount))
        // {
        //   console.log("test");

        //   startIndex = (totalPages - props.pagerCount) + 1;
        //   endIndex = totalPages;

        //   //props.selectedPageIndex = totalPages;
        //   //grid.selectedPageIndex = totalPages;
        // }
        
        for (let i = startIndex; i <= endIndex; i++) {
          const a = document.createElement("a");

          // Add class
          if (props.selectedPageIndex === i) {
            a.classList.add("selected");
          }

          a.appendChild(document.createTextNode(i));

          // Attibute
          a.setAttribute("value", i);
          
          // Event
          a.addEventListener("click", grid.on.pageIndexChanged.bind(grid, a));
          
          th.appendChild(a);
        }

        // Add next paging
        if (pageGroup < Math.ceil(totalPages / props.pagerCount)) {
          const a = document.createElement("a");
          
          a.appendChild(document.createTextNode("..."));
          
          // Attibute
          a.setAttribute("value", "next");
          
          // Event
          a.addEventListener("click", grid.on.pageIndexChanged.bind(grid, a));
          
          th.appendChild(a);
        }

        // Attributes
        th.setAttribute("colspan", grid.table.tHead.querySelectorAll("th").length);

        return th;
      },
      createCustomTableData: function() {
        const grid = this;
        const props = arguments[0];
        const tr = arguments[1];

        const td = props.isColumn 
          ? document.createElement("th") 
          : document.createElement("td");

        if (props.cellType
          && props.cellType.indexOf("|") > -1) {
          const control = grid.createCustomControl.call(grid, props, tr, td);
          const span = document.createElement("span");

          span.appendChild(control);
          td.appendChild(span);
        }

        return td;
      },
      createCustomControl: function() {
        const grid = this;
        const props = arguments[0];
        const tr = arguments[1];
        const td = arguments[2];
        
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
          // Add class
          td.classList.add("icon-size");
          td.classList.add("grd-checkbox");
    
          // Events
          if (props.isColumn) {              
            control.addEventListener("click", grid.on.checkAll.bind(grid, control));
          }
          else {
            control.addEventListener("click", grid.on.check.bind(grid, tr, control));
          }
        }
        // Toggle
        else if (elementType === "toggle") {
          // Add class
          td.classList.add("icon-size");
          td.classList.add("icon-toggle");

          if (props.isColumn 
            && props.hideColumn) {
            control.classList.add("hidden");
          }
          
          control.toggled = false;
          control.src = "/src/assets/toggle_expand.png";

          // Events
          if (props.isColumn) {
            control.addEventListener("click", grid.on.toggleAll.bind(grid, control));
          }
          else {
            control.addEventListener("click", grid.on.toggle.bind(grid, tr, control));
          }
        }

        return control;
      },
      on: {
        created: function() {
          const grid = this;

          // Do default behavior first
          if (grid.utility.hasCustomField.call(grid, "toggle")
            && grid.utility.getCustomField.call(grid, "toggle").autoOpen) {
            const imgToggleAll = grid.table.tHead.querySelector("th img[type='toggle']");
            
            imgToggleAll.click();
          }
          
          // Call user-defined event
          if (grid.events
            && typeof grid.events.created === "function") {
              grid.events.created.call(grid);
          }
        },
        sorted: function(sender, event) {
          const grid = this;
          
          // Do default behavior first
          // Sort list and direction
          const sortName = sender.getAttribute("sortName");
          let sortDirection = sender.getAttribute("sortDirection");

          if (sortDirection === "") {
            sortDirection = "ASC";
            sender.setAttribute("sortDirection", sortDirection);
            grid.sortList.push(sortName + " " + sortDirection);
          }
          else if (sortDirection === "ASC") {
            let index = grid.sortList.indexOf(sortName + " " + sortDirection);

            sortDirection = "DESC";
            sender.setAttribute("sortDirection", sortDirection);
            grid.sortList.splice(index, 1, sortName + " " + sortDirection);
          }
          else if (sortDirection === "DESC") {
            let index = grid.sortList.indexOf(sortName + " " + sortDirection);
            
            sortDirection = "";
            sender.setAttribute("sortDirection", sortDirection);
            grid.sortList.splice(index, 1);
          }

          console.log(grid.sortList);

          // Update table
          grid.getRowData();
          grid.createTableBody();
          
          // Call user-defined event
          if (grid.events
            && typeof grid.events.sorted === "function") {
              grid.events.sorted.call(grid, sender, event);
          }
        },
        rowCreated: function(sender, event) {
          const grid = this;
          
          // Do default behavior first
          
          // Call user-defined event
          if (grid.events
            && typeof grid.events.rowCreated === "function") {
              grid.events.rowCreated.call(grid, sender, event);
          }
        },
        checkAll: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const isChecked = sender.checked;
          const checkboxes = Array.from(grid.table.tBodies[0].querySelectorAll("td input[type=checkbox]"));

          checkboxes.forEach(function(checkbox) {
            checkbox.checked = isChecked;
          });

          // Call user-defined event
          if (grid.events
            && typeof grid.events.checkAll === "function") {
            grid.events.checkAll.call(grid, sender, event);
          }
        },
        check: function(row, sender, event) {
          const grid = this;

          // Do default behavior first
          const checkboxAll = grid.table.tHead.querySelector("th input[type=checkbox]");

          if (!sender.checked) {
            checkboxAll.checked = false
          }
          else {
            const checkboxes = Array.from(grid.table.tBodies[0].querySelectorAll("td input[type=checkbox]"));
            let hasUnchecked = false;
            
            checkboxes.forEach(function(checkbox) {
              if (!checkbox.checked) {
                hasUnchecked = true;
                return false;
              }
            });
            
            checkboxAll.checked = !hasUnchecked;
          }

          // Call user-defined event
          if (grid.events
            && typeof grid.events.check === "function") {
            grid.events.check.call(row, sender, event);
          }
          
          event.stopPropagation();
        },
        toggleAll: function(sender, event) {
          const grid = this;
          
          // Do default behavior first
          const imgToggles = Array.from(grid.table.tBodies[0].querySelectorAll("td img[type='toggle']"));

          sender.toggled = !sender.toggled;
          
          if (sender.toggled) {
            sender.src = "/src/assets/toggle_collapse.png";
          }
          else {
            sender.src = "/src/assets/toggle_expand.png";
          }

          imgToggles.forEach(function(imgToggle, index) {
            imgToggles.toggled = !imgToggles.toggled;
            imgToggle.click();
          });

          // Call user-defined event
          if (grid.events
            && typeof grid.events.toggleAll === "function") {
            grid.events.toggleAll.call(grid, sender, event);
          }

          event.stopPropagation();
        },
        toggle: function(row, sender, event) {
          const grid = this;
          
          // Do default behavior first
          sender.toggled = !sender.toggled;

          let tr = null;

          if (row.nextSibling
            && row.nextSibling.classList.contains("toggle-content")) {
            tr = row.nextSibling;
            tr.rowCreated = false;
          }
          else {
            // create new row
            tr = document.createElement("tr");
            tr.classList.add("toggle-content");
            tr.rowCreated = true;
            tr.appendAfter(row);
          }

          if (sender.toggled) {
            sender.src = "/src/assets/toggle_collapse.png";
            tr.classList.remove("hidden");
            sender.parentNode.parentNode.rowSpan = 2;
          }
          else {
            sender.src = "/src/assets/toggle_expand.png";
            tr.classList.add("hidden");            
            sender.parentNode.parentNode.removeAttribute("rowspan");
          }

          // Call user-defined event
          if (grid.events
            && typeof grid.events.toggle === "function") {
            grid.events.toggle.call(grid, sender, row , tr, event);
          }

          event.stopPropagation();
        },
        selectedIndexChanged: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const row = grid.table.tBodies[0].querySelectorAll("tr.selected");

          if(row.length) {
            row[0].classList.remove("selected");
          }
          sender.classList.add("selected");
          
          // Call user-defined event
          if (!grid.options.cancelSelectOnClick
            && grid.events
            && typeof grid.events.selectedIndexChanged === "function") {
            grid.events.selectedIndexChanged.call(grid, sender, event);
          }
        },
        pageIndexChanged: function(sender, event) {
          const grid = this;

          // Do default behavior first
          const value = sender.getAttribute("value");
          let selectedPageIndex = Number(grid.selectedPageIndex);
          const pageGroup = Math.ceil(selectedPageIndex / grid.options.pagerCount);

          if (value === "previous") {
            selectedPageIndex = ((pageGroup - 2) * grid.options.pagerCount) + 1; // add offset 1
          }
          else if (value === "next") {
            selectedPageIndex = (pageGroup * grid.options.pagerCount) + 1; // add offset 1
          }
          else {
            selectedPageIndex = Number(value);
          }

          grid.selectedPageIndex = selectedPageIndex;
          
          // Update table
          grid.getRowData();
          grid.createTableBody();
          grid.createTableFoot();

          // Call user-defined event
          if (grid.events
            && typeof grid.events.pageIndexChanged === "function") {
            grid.events.pageIndexChanged.call(grid, sender, event);
          }
        }
      },
      utility: {
        parseValue: function(value, type) {
          let newValue = null;

          if (type === "date") {
            newValue =
              value !== ""
                ? new Date(value).toLocaleDateString()
                : value;
          } else if (type === "number") {
            newValue = Number(value);
          } else {
            newValue = value;
          }

          return newValue;
        },
        hasCustomField: function(name) {
          const grid = this;
          const customFields = grid.options.customFields;
          let hasCustomField = false;
          
          for(let i = 0; i < customFields.length; i++) {
            if (customFields[i].type == name) {
              hasCustomField = true;
              break;
            }
          }

          return hasCustomField;
        },
        getCustomField: function(name) {
          const grid = this;
          const customFields = grid.options.customFields;
          let customField = null;
          
          for(let i = 0; i < customFields.length; i++) {
            if (customFields[i].type == name) {
              customField = customFields[i];

              break;
            }
          }

          return customField;
        }
      },
      service: {
        getColumns: function() {
          return [];
        },
        getRowData: function() {
          return [];
        },
        getTotalRecords: function() {
          return 115;
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