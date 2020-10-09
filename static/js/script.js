const exampleID = 4;

// small devices
if (window.screen.width < 576) {
}

$(document).ready(function () {
  showLoader();
  if ($("#preloader").length) {
    $("#preloader")
      .delay(200)
      .fadeOut("slow", function () {
        hideLoader();
        $("#preloader").remove();
      });
  }
  // set up data tables
  $("#employeesTable").DataTable({
    ajax: { url: "/static/php/personnel/getAllPersonnel.php", dataSrc: "data" },
    columns: [
      { data: "id" },
      { data: "lastName" },
      { data: "firstName" },
      { data: "jobTitle" },
      { data: "email" },
      { data: "department" },
      { data: "location" },
    ],
  });
  $("#departmentsTable").DataTable({
    ajax: { url: "/static/php/dept/getAllDepartments.php", dataSrc: "data" },
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "locationID" },
      { data: "location" },
    ],
  });
  $("#locationsTable").DataTable({
    ajax: { url: "/static/php/location/getAllLocations.php", dataSrc: "data" },
    columns: [{ data: "id" }, { data: "name" }],
  });
  // getLocationsForDropdowns();
  testFuncs();
});

$("#editEmployeeLocation").change(function () {
  getDepartmentsForDropdown($(this).val());
});

$("#navDeptsLink").click(function (e) {
  e.preventDefault();
  styleNavActive(e.target);
  showDepartmentsPage();
});

$("#navEmployeesLink").click(function (e) {
  e.preventDefault();
  styleNavActive(e.target);
  showEmployeesPage();
});

$("#navLocationsLink").click(function (e) {
  e.preventDefault();
  styleNavActive(e.target);
  showLocationsPage();
});

$("#navLogoutBtn").click(function (e) {
  e.preventDefault();
  clearNavActive();
  showLoginPage();
});

$("#newLocCancelBtn").click(function (e) {
  showLocationsPage();
});

$("#newDeptCancelBtn").click(function (e) {
  showDepartmentsPage();
});

$("#newEmployeeCancelBtn").click(function (e) {
  showEmployeesPage();
});

$("#editEmployeeCancelBtn").click(function (e) {
  showEmployeesPage();
});

$("#editLocCancelBtn").click(function (e) {
  showLocationsPage();
});

$("#editDeptCancelBtn").click(function (e) {
  showDepartmentsPage();
});

const testFuncs = () => {
  // showEmployeesPage();
  // showDepartmentsPage();
  // showLocationsPage();
  // showCreateLocationPage();
  // showCreateDepartmentPage();
  // showCreateEmployeePage();
  // showEditEmployeePage(exampleID);
  // showEditDepartmentPage(exampleID);
  // showEditLocationPage(exampleID);
  // showLoginPage();
};
