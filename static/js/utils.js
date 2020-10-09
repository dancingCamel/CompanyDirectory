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

const hideNav = () => {
  $("nav").hide();
};

const showNav = () => {
  $("nav").show();
};

const clearNavActive = () => {
  $(".nav-item").removeClass("active");
};

const styleNavActive = (link) => {
  clearNavActive();
  $(link.parentElement).addClass("active");
};

const getLocationsForDropdowns = async () => {
  const response = await Locations.fetchAllLocations();
  $.each($(".locationDropdown"), function () {
    $(this).empty();
    response.data.forEach((location) => {
      let $option = $(document.createElement("option"));
      $option.html(location.name);
      $option.val(location.id);
      $(this).append($option);
    });
  });
};

const getDepartmentsForDropdown = async (id) => {
  const response = await Departments.fetchDepartmentsByLocationID(id);
  $.each($(".departmentDropdown"), function () {
    $(this).empty();
    response.data.forEach((dept) => {
      let $option = $(document.createElement("option"));
      $option.html(dept.name);
      $option.val(dept.id);
      $(this).append($option);
    });
  });
};

const hideAllPages = () => {
  hideError();
  $.each($(".page"), function () {
    $(this).hide();
  });
};

const showLoginPage = () => {
  hideAllPages();
  $("nav").hide();
  $("#loginPage").show();
};

const showEmployeesPage = () => {
  hideAllPages();
  showNav();
  // repopulate employees table here
  $("#employeesPage").show();
};

const showDepartmentsPage = () => {
  hideAllPages();
  showNav();
  // repopulate departments table here
  $("#departmentsPage").show();
};

const showLocationsPage = () => {
  hideAllPages();
  showNav();
  // repopulate locations table here
  $("#locationsPage").show();
};

const showCreateLocationPage = () => {
  hideAllPages();
  showNav();
  $("#createLocationPage").show();
};

const showCreateDepartmentPage = () => {
  hideAllPages();
  showNav();
  $("#createDeptPage").show();
};

const showCreateEmployeePage = () => {
  hideAllPages();
  showNav();
  $("#createEmployeePage").show();
};

const showEditLocationPage = async (id) => {
  hideAllPages();
  showNav();
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

const showEditDepartmentPage = async (id) => {
  hideAllPages();
  showNav();
  showLoader();
  const response = await Departments.fetchDepartmentByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    hideLoader();
    return;
  } else {
    $("#editDeptId").val(response.data[0].id);
    $("#editDeptName").val(response.data[0].name);
    $("#editDeptLocation").val(response.data[0].locationID);
  }
  $("#editDeptPage").show();
  hideLoader();
};

const showEditEmployeePage = async (id) => {
  hideAllPages();
  showNav();
  showLoader();
  const response = await Employees.fetchEmployeeByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    hideLoader();
    return;
  } else {
    $("#editEmployeeId").val(response.data[0].id);
    $("#editEmployeeFirstName").val(response.data[0].firstName);
    $("#editEmployeeLastName").val(response.data[0].lastName);
    $("#editEmployeeEmail").val(response.data[0].email);
    $("#editEmployeeJobTitle").val(response.data[0].jobTitle);
    $("#editEmployeeLocation").val(response.data[0].locationID);
    getDepartmentsForDropdown(response.data[0].locationID);
    $("#editEmployeeDept").val(response.data[0].departmentID);
  }
  $("#editEmployeePage").show();
  hideLoader();
};
