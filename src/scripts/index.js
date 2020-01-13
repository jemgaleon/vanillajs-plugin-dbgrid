(function() {
  const grdWorksheet = document.getElementById("grdWorksheet");
  
  // Instance DBGrid Obj
  const dbgrid = new DBGrid({
    firstColumnCheckbox: true,
    cancelSelectOnClick: false,
    dataKeyNames: ["EXAM_KEY,CASE_KEY,SECTION,PRIORITY"],
    events: {
      rowClick: function(sender, event) {
        console.log(sender.dataset);
      }
    }
  });
  
  grdWorksheet.appendChild(dbgrid.table);
}());