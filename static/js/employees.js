class Employees {
  static async fetchAllEmployees(token) {
    let response = await fetch(
      "/companydirectory/static/php/personnel/getAllPersonnel.php",
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }

  static async fetchEmployeeByID(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch(
      "/companydirectory/static/php/personnel/getPersonnelByID.php",
      {
        method: "POST",
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }

  static async deleteEmployee(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch(
      "/companydirectory/static/php/personnel/deletePersonnelByID.php",
      {
        method: "POST",
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }

  static async insertEmployee(formData, token) {
    let response = await fetch(
      "/companydirectory/static/php/personnel/insertPersonnel.php",
      {
        method: "POST",
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }

  static async updateEmployeeByID(formData, token) {
    let response = await fetch(
      "/companydirectory/static/php/personnel/updatePersonnelByID.php",
      {
        method: "POST",
        headers: { Authorization: `JWT ${token}` },
        body: formData,
      }
    );
    let responseJson = await response.json();
    return responseJson;
  }
}
