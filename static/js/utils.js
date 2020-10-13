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

const activeNavEmployees = () => {
  clearNavActive();
  $("#navEmployeesLinkLi").addClass("active");
};

const activeNavDepts = () => {
  clearNavActive();
  $("#navDeptsLinkLi").addClass("active");
};

const activeNavLocations = () => {
  clearNavActive();
  $("#navLocationsLinkLi").addClass("active");
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
  activeNavEmployees();
  // repopulate employees table here
  $("#employeesPage").show();
};

const showDepartmentsPage = () => {
  hideAllPages();
  showNav();
  activeNavDepts();
  // repopulate departments table here
  $("#departmentsPage").show();
};

const showLocationsPage = () => {
  hideAllPages();
  showNav();
  activeNavLocations();
  // repopulate locations table here
  $("#locationsPage").show();
};

const showCreateLocationPage = () => {
  hideAllPages();
  showNav();
  activeNavLocations();
  getDepartmentsForDropdown($("#newEmployeeLocation").val());
  $("#createLocationPage").show();
};

const showCreateDepartmentPage = () => {
  hideAllPages();
  showNav();
  activeNavDepts();
  getLocationsForDropdowns();
  $("#createDeptPage").show();
};

const showCreateEmployeePage = () => {
  hideAllPages();
  showNav();
  activeNavEmployees();
  getLocationsForDropdowns();
  // set default values;
  $("#newEmployeeLocation").val(1);
  getDepartmentsForDropdown(1);
  $("#createEmployeePage").show();
};

const showEditLocationPage = async (id) => {
  hideAllPages();
  showNav();
  activeNavLocations();
  const response = await Locations.fetchLocationByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#editLocId").val(response.data[0].id);
    $("#editLocName").val(response.data[0].name);
  }
  $("#editLocationPage").show();
};

const showEditDepartmentPage = async (id) => {
  hideAllPages();
  showNav();
  activeNavDepts();
  getLocationsForDropdowns();
  const response = await Departments.fetchDepartmentByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#editDeptId").val(response.data[0].id);
    $("#editDeptName").val(response.data[0].name);
    $("#editDeptLocation").val(response.data[0].locationID);
  }
  $("#editDeptPage").show();
};

const showEditEmployeePage = async (id) => {
  hideAllPages();
  showNav();
  activeNavEmployees();
  getLocationsForDropdowns();
  const response = await Employees.fetchEmployeeByID(id);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
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
};

const createEmployee = async () => {
  const form = $("#createEmployeeForm").serializeArray();
  let fd = new FormData();
  console.log(form);
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Employees.insertEmployee(fd);

  // get row that was just inserted
  console.log(response);
  // employeesTable.clear().rows().add().draw();

  showEmployeesPage();
};

const loaderWrapper = (wrapped) => {
  showLoader();
  let result = function () {
    return wrapped.apply(this, arguments);
  };
  setTimeout(hideLoader, 500);
  return result;
};
