const showLoader = () => {
  $("#loader").modal({
    backdrop: "static",
    keyboard: false,
    show: true,
  });
};

const hideLoader = () => {
  $("#loader").modal("hide");
};

const showError = (message) => {
  $("#errorBox").text(`An error occurred: ${message}`);
  $("#errorBox").show();
};
const hideError = () => {
  $("#errorBox").hide();
};

const createTable = (element, data, columns) => {
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
};

const hideMain = () => {
  $("main").css("visibility", "hidden");
};

const showMain = () => {
  $("main").css("visibility", "visible");
};

const hideAllPages = () => {
  hideError();
  $.each($(".page"), function () {
    $(this).hide();
  });
};

const showEmployeesPage = () => {
  hideAllPages();
  // repopulate employees table here
  $("#employeesPage").show();
};

const showDepartmentsPage = () => {
  hideAllPages();
  // repopulate departments table here
  $("#departmentsPage").show();
};

const showLocationsPage = () => {
  hideAllPages();
  // repopulate locations table here
  $("#locationsPage").show();
};

const showCreateLocationPage = () => {
  hideAllPages();
  $("#createLocationPage").show();
};

const showCreateDepartmentPage = () => {
  hideAllPages();
  $("#createDeptPage").show();
};

const showCreateEmployeePage = () => {
  hideAllPages();
  $("#createEmployeePage").show();
};

const showEditLocationPage = async (id) => {
  hideAllPages();
  // populate form here
  showLoader();
  const response = await Locations.fetchLocationByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    hideLoader();
    return;
  } else {
    $("#editLocId").val(response.data[0].id);
    $("#editLocName").val(response.data[0].name);
  }
  $("#editLocationPage").show();
  hideLoader();
};

const showEditDepartmentPage = (id) => {
  hideAllPages();
  // populate form here
  $("#editDeptPage").show();
};

const showEditEmployeePage = (id) => {
  hideAllPages();
  // populate form here
  $("#editEmployeePage").show();
};
