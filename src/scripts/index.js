(function() {
  const grdWorksheet = document.getElementById("grdWorksheet");
  
  // Instance DBGrid
  const dbgrid = new DBGrid({
    firstColumnCheckbox: true,
    cancelSelectOnClick: false,
    events: {
      rowClick: function(sender, event) {
        console.log(sender.getAttribute("key"));
      }
    }
  });
  
  grdWorksheet.appendChild(dbgrid.table);
  
}());