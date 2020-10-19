class Departments {
  static async fetchAllDepartments(token) {
    let response = await fetch("/static/php/dept/getAllDepartments.php", {
      headers: { Authorization: `JWT ${token}` },
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async fetchDepartmentByID(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/dept/getDepartmentByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async fetchDepartmentsByLocationID(locationID, token) {
    var formData = new FormData();
    formData.append("locationID", locationID);
    let response = await fetch(
      "/static/php/dept/getDepartmentsByLocationID.php",
      {
        method: "POST",
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }

  static async deleteDepartment(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/dept/deleteDepartmentByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async insertDepartment(formData, token) {
    let response = await fetch("/static/php/dept/insertDepartment.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async updateDepartmentByID(formData, token) {
    let response = await fetch("/static/php/dept/updateDepartmentByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }
}
