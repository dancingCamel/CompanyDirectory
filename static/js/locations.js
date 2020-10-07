class Locations {
  constructor(data) {
    this.locations = data;
  }

  get getLocations() {
    return this.locations;
  }

  set setLocations(locations) {
    this.locations = locations;
  }

  static async fetchAllLocations() {
    let response = await fetch("/static/php/location/getAllLocations.php");
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async fetchLocationByID(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/location/getLocationByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async deleteLocation(id) {
    var formData = new FormData();
    formData.append("id", id);
    let response = await fetch("/static/php/location/deleteLocationByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async insertLocation(name) {
    var formData = new FormData();
    formData.append("name", name);
    let response = await fetch("/static/php/location/insertLocation.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }

  static async updateLocationByID(id, name) {
    var formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    let response = await fetch("/static/php/location/updateLocationByID.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson;
  }
}
