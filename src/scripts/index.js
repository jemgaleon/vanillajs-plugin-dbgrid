let dbgrid;

(function() {
  const grdWorksheet = document.getElementById("grdWorksheet");
  
  // Instance DBGrid Obj
  dbgrid = new DBGrid({
    gridName: "WORKLIST",
    cancelSelectOnClick: false,
    allowSorting: true,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    events: {
      rowCreated: function(sender, event) {
        //console.log(sender);
      },
      rowClick: function(sender, event) {
        console.log(sender.dataset);
        //console.log("user row click");
      },
      checkAll: function(sender, event) {
        console.log("user check all");
      },
      check: function(sender, event) {
        console.log("user check");
      }
    },
    customFields: [
      { type: "checkbox", index: 0, includeInHeader: true }
    ]
  });
  
  grdWorksheet.appendChild(dbgrid.table);
  grdWorksheet.classList.add("tblWrapper");
}());