class Employees {
  constructor(data) {
    this.employees = data;
  }

  get getEmployees() {
    return this.employees;
  }

  set setEmployees(employees) {
    this.employees = employees;
  }

  static async fetchAllEmployees() {
    let response = await fetch("/static/php/personnel/getAllPersonnel.php");
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async fetchEmployeeByID(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/personnel/getPersonnelByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    // console.log(responseJson);
    return responseJson;
  }

  static async deleteEmployee(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch(
      "/static/php/personnel/deletePersonnelByID.php",
      {
        method: "POST",
        body: formData,
      }
    );
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  // static async insertEmployee(
  //   firstName,
  //   lastName,
  //   email,
  //   jobTitle,
  //   locationID,
  //   departmentID
  // ) {
  //   var formData = new FormData();
  //   formData.append("firstName", firstName);
  //   formData.append("lastName", lastName);
  //   formData.append("email", email);
  //   formData.append("jobTitle", jobTitle);
  //   formData.append("locationID", locationID);
  //   formData.append("departmentID", departmentID);
  //   let response = await fetch("/static/php/personnel/insertPersonnel.php", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   let responseJson = await response.json();
  //   console.log(responseJson);
  //   return responseJson;
  // }

  static async insertEmployee(formData) {
    let response = await fetch("/static/php/personnel/insertPersonnel.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    // console.log(responseJson);
    return responseJson;
  }

  static async updateEmployeeByID(
    // id,
    // firstName,
    // lastName,
    // email,
    // jobTitle,
    // locationID,
    // departmentID
    formData
  ) {
    // var formData = new FormData();
    // formData.append("id", id);
    // formData.append("firstName", firstName);
    // formData.append("lastName", lastName);
    // formData.append("email", email);
    // formData.append("jobTitle", jobTitle);
    // formData.append("locationID", locationID);
    // formData.append("departmentID", departmentID);
    let response = await fetch(
      "/static/php/personnel/updatePersonnelByID.php",
      {
        method: "POST",
        body: formData,
      }
    );
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }
}
