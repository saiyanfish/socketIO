document.getElementById("signup-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  axios
    .post("/user/signup", {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    })
    .then(function (response) {
      console.log("Signup successful:", response.data);
      alert("Signup successful!");
      window.location.href = `http://${location.host}`;
    })
    .catch(function (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    });
});
