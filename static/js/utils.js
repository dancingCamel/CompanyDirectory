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

const showEmployeesPage = async (jwt) => {
  const token = jwt ? jwt : sessionStorage.getItem("jwt");
  hideAllPages();
  showNav();
  activeNavEmployees();
  if (!populatedEmployeesTable) {
    loaderWrapper(populateEmployeesTable(token));
    populatedEmployeesTable = true;
  }
  $("#employeesPage").show();
  $("#employeesTable").DataTable().columns.adjust().draw();
};

const showDepartmentsPage = async () => {
  hideAllPages();
  showNav();
  activeNavDepts();
  if (!populatedDepartmentsTable) {
    loaderWrapper(populateDepartmentsTable(sessionStorage.getItem("jwt")));
    populatedDepartmentsTable = true;
  }
  $("#departmentsPage").show();
  $("#departmentsTable").DataTable().columns.adjust().draw();
};

const showLocationsPage = async () => {
  hideAllPages();
  showNav();
  activeNavLocations();
  if (!populatedLocationsTable) {
    loaderWrapper(populateLocationsTable(sessionStorage.getItem("jwt")));
    populatedLocationsTable = true;
  }
  $("#locationsPage").show();
  $("#locationsTable").DataTable().columns.adjust().draw();
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

const insertEmployee = async () => {
  const form = $("#createEmployeeForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Employees.insertEmployee(fd);
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

const insertLocation = async () => {
  const form = $("#createLocationForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Locations.insertLocation(fd);
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

const insertDept = async () => {
  const form = $("#createDepartmentForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Departments.insertDepartment(fd);
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

const updateEmployee = async () => {
  const form = $("#updateEmployeeForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Employees.updateEmployeeByID(fd);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    console.log(response);
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

const updateLocation = async () => {
  const form = $("#updateLocationForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Locations.updateLocationByID(fd);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    console.log(response);
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

const updateDept = async () => {
  const form = $("#updateDeptForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await Departments.updateDepartmentByID(fd);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    showError(response.status.description);
    return;
  } else {
    console.log(response);
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
  $("#loginErrorContainer").addClass("d-none");
  $("#loginErrorBox").text("");
  const form = $("#loginForm").serializeArray();
  let fd = new FormData();
  form.forEach((element) => fd.append(element.name, element.value));
  let response = await User.login(fd);
  if (!(response.status.code == 200 && response.status.name == "ok")) {
    $("#loginErrorBox").text(
      `An error occurred: ${response.status.description}`
    );
    $("#loginErrorContainer").removeClass("d-none");
    return;
  } else {
    sessionStorage.setItem("jwt", response.data.jwt);
    sessionStorage.setItem("username", response.data.username);
    $("#loginForm")[0].reset();
  }

  loaderWrapper(showEmployeesPage(response.data.jwt));
};

const userLogout = async () => {
  sessionStorage.setItem("jwt", "");
  sessionStorage.setItem("username", "");
  sessionStorage.clear();
  // clear tables
  // reload page
  location.reload();
};

const loaderWrapper = (wrapped) => {
  showLoader();
  let result = async function () {
    return await wrapped.apply(this, arguments);
  };
  setTimeout(hideLoader, 700);
  return result;
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
        // width: 180,
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
