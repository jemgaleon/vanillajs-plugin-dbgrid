let dbgrid;

(function() {
  const grdWorksheet = document.getElementById("grdWorksheet");
  
  // Instance DBGrid Obj
  dbgrid = new DBGrid({
    gridName: "WORKLIST",
    additionalCriteria: "",
    cancelSelectOnClick: false,
    allowSorting: true,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    events: {
      rowCreated: function(sender, event) {
        //console.log(sender);
      },
      rowClick: function(sender, event) {
        console.log(sender);
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
      toggle: function(sender, event) {
        console.log("user toggle: " + sender.toggled);
        console.log(this);
        
        // todo need a better way to get selected row
      }
    },
    customFields: [
      { type: "toggle", hideColumn: true, autoOpen: true },
      { type: "checkbox" }
    ]
  });
  
  grdWorksheet.appendChild(dbgrid.table);
  grdWorksheet.classList.add("tblWrapper");
}());