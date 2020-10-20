class User {
  static async login(formData) {
    let response = await fetch("/companydirectory/static/php/user/login.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }
}
