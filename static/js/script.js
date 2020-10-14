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
  // set up data tables
  const employeesTable = $("#employeesTable").DataTable({
    responsive: true,
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
        .columns([1, 3, 5, 6])
        .every(function () {
          var column = this;
          var columnIndex = column.index();
          var select = $(
            '<select><option value="">' +
              column.header().innerHTML +
              "</option></select>"
          );
          // add to row of other table here
          // .prependTo(employeesFilterTable.columns([columnIndex]).cells());
          // this on change function needs to be a seperate function, invoked in the onChange handler of html in render function
          // .on("change", function () {
          //   var val = $.fn.dataTable.util.escapeRegex($(this).val());
          //   // column.search(val ? "^" + val + "$" : "", true, false).draw();

          //   employeesTable
          //     .columns([columnIndex])
          //     .search(val ? "^" + val + "$" : "", true, false)
          //     .draw();
          // });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              // here we need to select the cell data in other table
              let $option = $(document.createElement("option"));
              $option.val(d);
              $option.html(d);
              console.log(employeesFilterTable.cell(1, columnIndex));
              $(".employeeFilterSelect")[Math.floor(columnIndex / 2)].append(
                $option
              );
              // need to draw the table every time we append data? can chain it?
              employeesFilterTable.draw();
            });
        });
    },
  });

  $(".employeeFilterSelect").on("change", function () {
    var val = $.fn.dataTable.util.escapeRegex($(this).val());
    // column.search(val ? "^" + val + "$" : "", true, false).draw();

    employeesTable
      .columns([columnIndex])
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

  // employees filter table
  // the data in this table overwrites anything added in the last table.
  // don't make this a data table? just manually put selects in the main page and populate from employeesTable data
  // leave the on change function
  const employeesFilterTable = $("#employeesFilterTable").DataTable({
    paging: false,
    ordering: false,
    searching: false,
    info: false,
    responsive: true,
    columnDefs: [
      {
        render: function (data, type, row) {
          return (
            '<select class="employeeFilterSelect"><option value="">' +
            // grab name from other table
            employeesTable.column([1]).header().innerHTML +
            "</option></select>"
          );
        },
        targets: 0,
      },
      {
        render: function (data, type, row) {
          return (
            '<select class="employeeFilterSelect"><option value="">' +
            // grab name from other table
            employeesTable.column([3]).header().innerHTML +
            "</option></select>"
          );
        },
        targets: 2,
      },
      {
        render: function (data, type, row) {
          return (
            '<select class="employeeFilterSelect"><option value="">' +
            // grab name from other table
            employeesTable.column([4]).header().innerHTML +
            "</option></select>"
          );
        },
        targets: 4,
      },
      {
        render: function (data, type, row) {
          return (
            '<select class="employeeFilterSelect"><option value="">' +
            // grab name from other table
            employeesTable.column([5]).header().innerHTML +
            "</option></select>"
          );
        },
        targets: 5,
      },
    ],
    // working here
    // initComplete: function () {
    //   this.api()
    //     .columns()
    //     .every(function () {
    //       var column = this;
    //       var columnIndex = column.index();
    //       console.log(columnIndex);
    //       var select = $(
    //         '<select><option value="">' +
    //           column.header().innerHTML +
    //           "</option></select>"
    //       )
    //         .prependTo($(column.footer()).empty())
    //         .on("change", function () {
    //           var val = $.fn.dataTable.util.escapeRegex($(this).val());

    //           column.search(val ? "^" + val + "$" : "", true, false).draw();
    //         });

    //       // this function is running before getting data from ajax in other table.
    //       employeesTable
    //         .columns([columnIndex])
    //         .data()
    //         .unique()
    //         .sort()
    //         .each(function (d, j) {
    //           console.log(d);
    //           // select.append('<option value="' + d + '">' + d + "</option>");
    //         });
    //     });
    // },
  });

  const departmentsTable = $("#departmentsTable").DataTable({
    responsive: true,
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
        .columns([1, 2, 3])
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
  showEmployeesPage();
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
