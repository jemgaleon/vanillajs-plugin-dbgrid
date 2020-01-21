(function() {
  // Instance DBGrid Obj
  const dbgrid = new DBGrid({
    wrapper: "#grdWorksheet",
    gridName: "WORKSHEET",
    additionalCriteria: "",
    allowSorting: true,
    allowPaging: true,
    pageSize: 5,
    pagerCount: 10,
    cancelSelectOnClick: true,
    width: 900,
    height: 300,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    columns: [
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
    ],
    rowData: [
      [1,1,"FA","Normal","2009-0003","","","Ready For Review","2009-000-1234",""],
      [2,1,"CS","Normal","2009-0003","01/01/2020","01/01/2020","Draft Printed","2009-000-114","1,2"],
      [3,1,"CSAS","High","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      [4,1,"CSAS","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      [5,1,"BAC","Low","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"]
      // [6,1,"BIO","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      // [7,1,"BAC","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      // [8,1,"CSAS","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      // [9,1,"FA","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"],
      // [10,1,"BIO","Normal","2009-0003","01/01/2020","","Approved","2009-000-1234","3,4,5"]
    ],
    events: {
      rowCreated: function(sender, event) {
        //console.log(sender);
      },
      rowClick: function(sender, event) {
        //console.log(sender);
        //console.log(sender.dataset);
        //console.log("user row click");
      },
      checkAll: function(sender, event) {
        //console.log("user check all");
      },
      check: function(sender, event) {
        //console.log("user check");
        //console.log(this);
      },
      toggle: function(sender, row, contentRow, event) {
        const grid = this;

        //console.log("user toggle: " + sender.toggled);
        
        if(contentRow.rowCreated) {
          const td = document.createElement("td");
          const div = document.createElement("div");
          const dbgridChild = new DBGrid({
            gridName: "WORKSHEETS",
            cancelSelectOnClick: true,
            customFields: [
              { type: "checkbox" }
            ],
            columns: [
              { text: "Section", value: "SECTION", type: "string", dataKey: true },
              { text: "Description", value: "DESCRIPTION", type: "string", dataKey: true }
            ],
            rowData: [
              [ "FA", "FA-FA Blank Worksheet"],
              [ "FA", "FA-Microscopy Bullet Case Notes"],
              [ "FA", "FA-FA Blank Worksheet"],
              [ "FA", "FA-FA Blank Worksheet"]
            ]
          });

          dbgridChild.table.classList.add("tableception"); // header index issue fix
          div.appendChild(dbgridChild.table);
          div.classList.add("toggleWrapper");
          td.appendChild(div);
          td.setAttribute("colSpan", row.children.length - 1); // minus toggle count
          contentRow.appendChild(td);
        }
      }
    },
    customFields: [
      { type: "toggle", hideColumn: true, autoOpen: false }
    ]
  });
}());