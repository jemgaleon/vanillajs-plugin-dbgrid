let exposeMe;

(function() {
  // Instance DBGrid Obj
  const dbgrid = new DBGrid({
    wrapper: "#grdWorksheet",
    gridName: "ASSIGNMENTS",
    additionalCriteria: "",
    allowSorting: true,
    allowPaging: true,
    cancelSelectOnClick: false,
    width: 900,
    height: 200,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    events: {
      rowCreated: function(sender, event) {
        //console.log(sender);
      },
      rowClick: function(sender, event) {
        //console.log(sender);
        console.log(sender.dataset);
        console.log("user row click");
      },
      checkAll: function(sender, event) {
        console.log("user check all");
      },
      check: function(sender, event) {
        console.log("user check");
        console.log(this);
      },
      toggle: function(sender, row, contentRow, event) {
        const grid = this;

        console.log("user toggle: " + sender.toggled);
        
        if(contentRow.rowCreated) {
          const td = document.createElement("td");

          td.colSpan = row.children.length - 1; // minus toggle count

          const div = document.createElement("div");
          div.classList.add("toggleWrapper");

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

          dbgridChild.table.classList.add("tableception");
          div.appendChild(dbgridChild.table);
          td.appendChild(div);
          contentRow.appendChild(td);

          //exposeMe = dbgridChild;
        }
      }
    },
    customFields: [
      { type: "toggle", hideColumn: true, autoOpen: false }
    ]
  });

  exposeMe = dbgrid;
  //grdWorksheet.appendChild(dbgrid.table);
  //grdWorksheet.classList.add("tblWrapper");
}());