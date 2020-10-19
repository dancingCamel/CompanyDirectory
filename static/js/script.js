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

  $(".navbar-nav>li>a").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // set up data table functionality

  $(".employeeFilterSelect").on("change", function () {
    var val = $.fn.dataTable.util.escapeRegex($(this).val());

    employeesTable
      .columns([$(this).data("column")])
      .search(val ? "^" + val + "$" : "", true, false)
      .draw();
  });

  $("#employeesTable tbody").on("click", "tr .edit", function () {
    const id = $(this).data("row");
    loaderWrapper(showEditEmployeePage(id));
  });

  $("#employeesTable tbody").on("click", ".delete", async function () {
    const token = sessionStorage.getItem("jwt");
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const shouldDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!!(shouldDelete.value && shouldDelete.value === true)) {
      const response = await Employees.deleteEmployee(id, token);
      if (response.status.code == 401) {
        showLoginError("For security, please log in again.");
        showLoginPage();
        return;
      }
      if (response.status.code == 200 && response.status.name === "ok") {
        employeesTable.row(row).remove().draw();
      } else {
        showError(response.status.description);
      }
    }
  });

  $(".departmentFilterSelect").on("change", function () {
    var val = $.fn.dataTable.util.escapeRegex($(this).val());

    departmentsTable
      .columns([$(this).data("column")])
      .search(val ? "^" + val + "$" : "", true, false)
      .draw();
  });

  $("#departmentsTable tbody").on("click", "tr .edit", function () {
    const id = $(this).data("row");
    loaderWrapper(showEditDepartmentPage(id));
  });

  $("#departmentsTable tbody").on("click", ".delete", async function () {
    const token = sessionStorage.getItem("jwt");
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const shouldDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!!(shouldDelete.value && shouldDelete.value === true)) {
      const response = await Departments.deleteDepartment(id, token);
      if (response.status.code == 401) {
        showLoginError("For security, please log in again.");
        showLoginPage();
        return;
      }
      if (response.status.code == 200 && response.status.name === "ok") {
        departmentsTable.row(row).remove().draw();
      } else {
        showError(response.status.description);
      }
    }
  });

  $("#locationsTable tbody").on("click", "tr .edit", function () {
    const id = $(this).data("row");
    loaderWrapper(showEditLocationPage(id));
  });

  $("#locationsTable tbody").on("click", ".delete", async function () {
    const token = sessionStorage.getItem("jwt");
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const shouldDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!!(shouldDelete.value && shouldDelete.value === true)) {
      const response = await Locations.deleteLocation(id, token);
      if (response.status.code == 401) {
        showLoginError("For security, please log in again.");
        showLoginPage();
        return;
      }
      if (response.status.code == 200 && response.status.name === "ok") {
        locationsTable.row(row).remove().draw();
      } else {
        showError(response.status.description);
      }
    }
  });

  $(".locationFilterSelect").on("change", function () {
    var val = $.fn.dataTable.util.escapeRegex($(this).val());

    locationsTable
      .columns([$(this).data("column")])
      .search(val ? "^" + val + "$" : "", true, false)
      .draw();
  });
});

$("#editEmployeeLocation").change(function () {
  getDepartmentsForDropdown($(this).val());
});

$("#newEmployeeLocation").change(function () {
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
  userLogout();
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

$("#employeesPageCreateBtn").click(function () {
  showCreateEmployeePage();
});

$("#locationsPageCreateBtn").click(function () {
  showCreateLocationPage();
});

$("#departmentsPageCreateBtn").click(function () {
  showCreateDepartmentPage();
});

$(".createBtn").click(function (e) {
  e.preventDefault();
  switch ($(this).data("form")) {
    case "createDept":
      checkLoggedIn(insertDept());
      break;
    case "createLocation":
      checkLoggedIn(insertLocation());
      break;
    case "createEmployee":
      checkLoggedIn(insertEmployee());
      break;
  }
});

$(".updateBtn").click(function (e) {
  e.preventDefault();
  switch ($(this).data("form")) {
    case "updateDept":
      checkLoggedIn(updateDept());
      break;
    case "updateLocation":
      checkLoggedIn(updateLocation());
      break;
    case "updateEmployee":
      checkLoggedIn(updateEmployee());
      break;
  }
});

$("#loginBtn").click(function (e) {
  e.preventDefault();
  userLogin();
});
