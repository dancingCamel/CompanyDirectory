class Locations {
  static async fetchAllLocations(token) {
    let response = await fetch("/static/php/location/getAllLocations.php", {
      headers: { Authorization: `JWT ${token}` },
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async fetchLocationByID(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/location/getLocationByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async deleteLocation(id, token) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/location/deleteLocationByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async insertLocation(formData, token) {
    let response = await fetch("/static/php/location/insertLocation.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }

  static async updateLocationByID(formData, token) {
    let response = await fetch("/static/php/location/updateLocationByID.php", {
      method: "POST",
      headers: { Authorization: `JWT ${token}` },
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }
}
