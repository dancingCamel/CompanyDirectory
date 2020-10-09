class Departments {
  constructor(data) {
    this.departments = data;
  }

  get getDepartments() {
    return this.departments;
  }

  set setDepartments(departments) {
    this.departments = departments;
  }

  static async fetchAllDepartments() {
    let response = await fetch("/static/php/dept/getAllDepartments.php");
    let responseJson = await response.json();
    // console.log(responseJson);
    return responseJson;
  }

  static async fetchDepartmentByID(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/dept/getDepartmentByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    // console.log(responseJson);
    return responseJson;
  }

  static async fetchDepartmentsByLocationID(locationID) {
    var formData = new FormData();
    formData.append("locationID", locationID);
    let response = await fetch(
      "/static/php/dept/getDepartmentsByLocationID.php",
      {
        method: "POST",
        body: formData,
      }
    );
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async deleteDepartment(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/dept/deleteDepartmentByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async insertDepartment(name, locationID) {
    var formData = new FormData();
    formData.append("name", name);
    formData.append("locationID", locationID);
    let response = await fetch("/static/php/dept/insertDepartment.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async updateDepartmentByID(id, name, locationID) {
    var formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("locationID", locationID);
    let response = await fetch("/static/php/dept/updateDepartmentByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }
}
