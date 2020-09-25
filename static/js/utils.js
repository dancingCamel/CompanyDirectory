function showLoader() {
  $("#loader").modal({
    backdrop: "static",
    keyboard: false,
    show: true,
  });
}

function hideLoader() {
  $("#loader").modal("hide");
}

function showError(message) {
  $("#errorBox").text(`An error occurred: ${message}`);
  $("#errorBox").show();
}
function hideError() {
  $("#errorBox").hide();
}

function createTable(element, data, columns) {
  let columnsObjects = [];

  columns.forEach((column) => {
    let temp = {};
    temp["title"] = column;
    columnsObjects.push(temp);
  });

  $(element).DataTable({
    data: data,
    columns: columnsObjects,
    paging: false,
    info: false,
    searching: false,
    destroy: true,
  });
}

function hideMain() {
  $("main").css("visibility", "hidden");
}

function showMain() {
  $("main").css("visibility", "visible");
}
