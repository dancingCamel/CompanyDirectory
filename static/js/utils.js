// Toastr settings
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

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
  $("#errorBox").removeClass("d-none");
};
const hideError = () => {
  $("#errorBox").addClass("d-none");
};

const hideMain = () => {
  $("main").css("visibility", "hidden");
};

const showMain = () => {
  $("main").css("visibility", "visible");
};

const hideNav = () => {
  $("nav").addClass("d-none");
};

const showNav = () => {
  $("nav").removeClass("d-none");
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

const getLocationsForDropdowns = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const response = await Locations.fetchAllLocations(token);
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

const getDepartmentsForDropdown = async (id, jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const response = await Departments.fetchDepartmentsByLocationID(id, token);
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
    $(this).addClass("d-none");
  });
};

const showLoginPage = () => {
  hideAllPages();
  $("nav").addClass("d-none");
  $("#loginPage").removeClass("d-none");
};

const showEmployeesPage = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavEmployees();
  if (!populatedEmployeesTable) {
    loaderWrapper(populateEmployeesTable(token));
    populatedEmployeesTable = true;
  }
  $("#employeesPage").removeClass("d-none");
  $("#employeesTable").DataTable().columns.adjust().draw();
};

const showDepartmentsPage = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavDepts();
  if (!populatedDepartmentsTable) {
    loaderWrapper(populateDepartmentsTable(token));
    populatedDepartmentsTable = true;
  }
  $("#departmentsPage").removeClass("d-none");
  $("#departmentsTable").DataTable().columns.adjust().draw();
};

const showLocationsPage = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavLocations();
  if (!populatedLocationsTable) {
    loaderWrapper(populateLocationsTable(token));
    populatedLocationsTable = true;
  }
  $("#locationsPage").removeClass("d-none");
  $("#locationsTable").DataTable().columns.adjust().draw();
};

const showCreateLocationPage = () => {
  hideAllPages();
  showNav();
  activeNavLocations();
  getDepartmentsForDropdown($("#newEmployeeLocation").val());
  $("#createLocationPage").removeClass("d-none");
};

const showCreateDepartmentPage = () => {
  hideAllPages();
  showNav();
  activeNavDepts();
  getLocationsForDropdowns();
  $("#createDeptPage").removeClass("d-none");
};

const showCreateEmployeePage = () => {
  hideAllPages();
  showNav();
  activeNavEmployees();
  getLocationsForDropdowns();
  // set default values
  $("#newEmployeeLocation").val(1);
  getDepartmentsForDropdown(1);
  $("#createEmployeePage").removeClass("d-none");
};

const showEditLocationPage = async (id, jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavLocations();
  const response = await Locations.fetchLocationByID(id, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#editLocId").val(response.data[0].id);
    $("#editLocName").val(response.data[0].name);
  }
  $("#editLocationPage").removeClass("d-none");
};

const showEditDepartmentPage = async (id, jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavDepts();
  getLocationsForDropdowns(token);
  const response = await Departments.fetchDepartmentByID(id, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#editDeptId").val(response.data[0].id);
    $("#editDeptName").val(response.data[0].name);
    $("#editDeptLocation").val(response.data[0].locationID);
  }
  $("#editDeptPage").removeClass("d-none");
};

const showEditEmployeePage = async (id, jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavEmployees();
  getLocationsForDropdowns(token);
  const response = await Employees.fetchEmployeeByID(id, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
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
    getDepartmentsForDropdown(response.data[0].locationID, token);
    $("#editEmployeeDept").val(response.data[0].departmentID);
  }
  $("#editEmployeePage").removeClass("d-none");
};

const insertEmployee = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#createEmployeeForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Employees.insertEmployee(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#employeesTable").DataTable().row.add(response.data[0]).draw(false);
    toastr["success"]("Employee Created", "Success");
    $("#createEmployeeForm")[0].reset();
  }
  showEmployeesPage();
};

const insertLocation = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#createLocationForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Locations.insertLocation(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#locationsTable").DataTable().row.add(response.data[0]).draw(false);
    toastr["success"]("Location Created", "Success");
    $("#createLocationForm")[0].reset();
  }
  showLocationsPage();
};

const insertDept = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#createDepartmentForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Departments.insertDepartment(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#departmentsTable").DataTable().row.add(response.data[0]).draw(false);
    toastr["success"]("Department Created", "Success");
    $("#createDepartmentForm")[0].reset();
  }
  showDepartmentsPage();
};

const updateEmployee = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#updateEmployeeForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Employees.updateEmployeeByID(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#employeesTable")
      .DataTable()
      .row(fd.id)
      .data(response.data[0])
      .draw(false);
    toastr["success"]("Employee Updated", "Success");
    $("#updateEmployeeForm")[0].reset();
  }
  showEmployeesPage();
};

const updateLocation = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#updateLocationForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Locations.updateLocationByID(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#locationsTable")
      .DataTable()
      .row(fd.id)
      .data(response.data[0])
      .draw(false);
    toastr["success"]("Location Updated", "Success");
    $("#updateLocationForm")[0].reset();
  }
  showLocationsPage();
};

const updateDept = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  const form = $("#updateDeptForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Departments.updateDepartmentByID(fd, token);
  if (response.status.code == 401) {
    showLoginError("For security, please log in again.");
    showLoginPage();
    return;
  }
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    $("#departmentsTable")
      .DataTable()
      .row(fd.id)
      .data(response.data[0])
      .draw(false);
    toastr["success"]("Department Updated", "Success");
    $("#updateDeptForm")[0].reset();
  }
  showDepartmentsPage();
};

const userLogin = async () => {
  hideLoginError();
  const form = $("#loginForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await User.login(fd);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showLoginError(response.status.description);
    return;
  } else {
    sessionStorage.setItem("jwt", response.data.jwt);
    sessionStorage.setItem("username", response.data.username);
    $("#loginForm")[0].reset();
  }

  loaderWrapper(showEmployeesPage(response.data.jwt));
};

const showLoginError = (message) => {
  $("#loginErrorBox").text(`An error occurred: ${message}`);
  $("#loginErrorContainer").removeClass("d-none");
};

const hideLoginError = () => {
  $("#loginErrorContainer").addClass("d-none");
  $("#loginErrorBox").text("");
};

const userLogout = async () => {
  sessionStorage.setItem("jwt", "");
  sessionStorage.setItem("username", "");
  sessionStorage.clear();
  clearTables();
  // reload page
  location.reload();
};

const clearTables = () => {
  if (locationsTable) {
    locationsTable.clear().draw();
  }
  if (employeesTable) {
    employeesTable.clear().draw();
  }
  if (departmentsTable) {
    departmentsTable.clear().draw();
  }
};

// set up data tables
let employeesTable;
let populatedEmployeesTable = false;
const populateEmployeesTable = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  employeesTable = $("#employeesTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: {
      url: "/static/php/personnel/getAllPersonnel.php",
      headers: { Authorization: `JWT ${token}` },
      dataSrc: function (json) {
        return json.data;
      },
    },
    columns: [
      { data: "id", visible: false },
      { data: "lastName" },
      { data: "firstName" },
      { data: "jobTitle" },
      { data: "email" },
      { data: "department" },
      { data: "location" },
      {
        data: null,
        orderable: false,
        render: function (data, type, row, meta) {
          return (
            '<div><button class="btn btn-primary mr-2 table-button edit" data-row=' +
            row.id +
            '><i class="fas fa-edit"></i></button><button class="btn btn-danger table-button delete" data-row=' +
            row.id +
            '><i class="fas fa-trash-alt"></i></button></div>'
          );
        },
      },
    ],
    initComplete: function () {
      this.api()
        .columns([1, 3, 5, 6])
        .every(function () {
          var column = this;
          var columnIndex = column.index();
          var select = $(
            '<select><option value="">' +
              column.header().innerHTML +
              "</option></select>"
          );

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              let $option = $(document.createElement("option"));
              $option.val(d);
              $option.html(d);
              $($(".employeeFilterSelect")[Math.floor(columnIndex / 2)]).append(
                $option
              );
            });
        });
    },
  });
};

let departmentsTable;
let populatedDepartmentsTable = false;
const populateDepartmentsTable = (jwt) => {
  departmentsTable = $("#departmentsTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: {
      url: "/static/php/dept/getAllDepartments.php",
      headers: { Authorization: `JWT ${jwt}` },
      dataSrc: "data",
    },
    columns: [
      { data: "id", visible: false },
      { data: "name" },
      { data: "locationID", visible: false },
      { data: "location" },
      {
        data: null,
        orderable: false,
        width: "180px",
        render: function (data, type, row, meta) {
          return (
            '<div><button class="btn btn-primary mr-2 table-button edit" data-row=' +
            row.id +
            '><i class="fas fa-edit"></i></button><button class="btn btn-danger table-button delete" data-row=' +
            row.id +
            '><i class="fas fa-trash-alt"></i></button></div>'
          );
        },
      },
    ],
    initComplete: function () {
      this.api()
        .columns([3])
        .every(function () {
          var column = this;
          var columnIndex = column.index();
          var select = $(
            '<select><option value="">' +
              column.header().innerHTML +
              "</option></select>"
          );

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              let $option = $(document.createElement("option"));
              $option.val(d);
              $option.html(d);
              $($(".departmentFilterSelect")[0]).append($option);
            });
        });
    },
  });
};

let locationsTable;
let populatedLocationsTable = false;
const populateLocationsTable = (jwt) => {
  locationsTable = $("#locationsTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: {
      url: "/static/php/location/getAllLocations.php",
      headers: { Authorization: `JWT ${jwt}` },
      dataSrc: "data",
    },
    columns: [
      { data: "id", visible: false },
      { data: "name" },
      {
        data: null,
        orderable: false,
        width: "180px",
        render: function (data, type, row, meta) {
          return (
            '<div><button class="btn btn-primary mr-2 table-button edit" data-row=' +
            row.id +
            '><i class="fas fa-edit"></i></button><button class="btn btn-danger table-button delete" data-row=' +
            row.id +
            '><i class="fas fa-trash-alt"></i></button></div>'
          );
        },
      },
    ],
    initComplete: function () {
      this.api()
        .columns([1])
        .every(function () {
          var column = this;
          var columnIndex = column.index();
          var select = $(
            '<select><option value="">' +
              column.header().innerHTML +
              "</option></select>"
          );

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              let $option = $(document.createElement("option"));
              $option.val(d);
              $option.html(d);
              $($(".locationFilterSelect")[0]).append($option);
            });
        });
    },
  });
};

// wrappers
const loaderWrapper = (wrapped) => {
  showLoader();
  let result = async function () {
    return await wrapped.apply(this, arguments);
  };
  setTimeout(hideLoader, 700);
  return result;
};

const checkLoggedIn = (wrapped) => {
  // check if have jwt set in session storage to prevent hitting endpoints unnecessarily
  const jwt = sessionStorage.getItem("jwt");
  if (jwt === null) {
    userLogout();
    showLoginError("Please log in to perform this action");
  }
  let result = async function () {
    return await wrapped.apply(this, arguments);
  };
  return result;
};
