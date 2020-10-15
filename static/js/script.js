const exampleID = 2;

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

  $(".navbar-nav>li>a").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });

  // set up data tables
  const employeesTable = $("#employeesTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: { url: "/static/php/personnel/getAllPersonnel.php", dataSrc: "data" },
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

  $(".employeeFilterSelect").on("change", function () {
    console.log(this);
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
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const response = await Employees.deleteEmployee(id);
    if (response.status.code == 200 && response.status.name === "ok") {
      employeesTable.row(row).remove().draw();
    } else {
      showError(response.status.description);
    }
  });

  const departmentsTable = $("#departmentsTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: { url: "/static/php/dept/getAllDepartments.php", dataSrc: "data" },
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

  $(".departmentFilterSelect").on("change", function () {
    console.log(this);
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
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const response = await Departments.deleteDepartment(id);
    if (response.status.code == 200 && response.status.name === "ok") {
      departmentsTable.row(row).remove().draw();
    } else {
      showError(response.status.description);
    }
  });

  const locationsTable = $("#locationsTable").DataTable({
    responsive: true,
    autoWidth: false,
    ajax: { url: "/static/php/location/getAllLocations.php", dataSrc: "data" },
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
          var select = $(
            '<select><option value="">' +
              column.header().innerHTML +
              "</option></select>"
          )
            .appendTo($(column.footer()).empty())
            .on("change", function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());

              column.search(val ? "^" + val + "$" : "", true, false).draw();
            });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              select.append('<option value="' + d + '">' + d + "</option>");
            });
        });
    },
  });

  $("#locationsTable tbody").on("click", "tr .edit", function () {
    const id = $(this).data("row");
    loaderWrapper(showEditLocationPage(id));
  });

  $("#locationsTable tbody").on("click", ".delete", async function () {
    const id = $(this).data("row");
    const row = $(this).parents("tr");
    const response = await Locations.deleteLocation(id);
    if (response.status.code == 200 && response.status.name === "ok") {
      locationsTable.row(row).remove().draw();
    } else {
      showError(response.status.description);
    }
  });

  testFuncs();
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
      insertDept();
      break;
    case "createLocation":
      insertLocation();
      break;
    case "createEmployee":
      insertEmployee();
      break;
  }
});

$(".updateBtn").click(function (e) {
  e.preventDefault();
  switch ($(this).data("form")) {
    case "updateDept":
      updateDept();
      break;
    case "updateLocation":
      updateLocation();
      break;
    case "updateEmployee":
      updateEmployee();
      break;
  }
});

const testFuncs = () => {
  // showEmployeesPage();
  // showDepartmentsPage();
  showLocationsPage();
  // showCreateLocationPage();
  // showCreateDepartmentPage();
  // showCreateEmployeePage();
  // showEditEmployeePage(exampleID);
  // showEditDepartmentPage(exampleID);
  // showEditLocationPage(exampleID);
  // showLoginPage();
};
