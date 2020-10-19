class User {
  static async login(formData) {
    let response = await fetch("/static/php/user/login.php", {
      method: "POST",
      body: formData,
    });
    let responseJson = await response.json();
    return responseJson;
  }
}
