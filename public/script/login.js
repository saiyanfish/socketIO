document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  axios
    .post("/user/login", {
      email: email,
      password: password,
    })
    .then(function (response) {
      console.log("login successful:", response.data);
      alert("login successful!");
      window.location.href = `http://${location.host}`;
    })
    .catch(function (error) {
      console.error("login error:", error);
      alert("login failed. Please try again.");
    });
});
