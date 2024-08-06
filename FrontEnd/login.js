login(); // Appel de la fonction
function login() {
  const logForm = document.getElementById("form-login");
  logForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // création de l'objet user
    const user = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    const error = document.getElementById("error");
    // Création de la charge utile au format JSON
    const payload = JSON.stringify(user);
    // Appel de la fonction fetch
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          alert("Connexion réussie ! Redirection...");
          window.location.href = "index.html";
        } else {
          // Affichage d'un message d'erreur si les informations de connexion sont incorrectes
          error.textContent = "Email ou mot de passe incorrect";
          error.style.color = "red";
        }
      })
      .catch((error) => {
        console.log("Erreur lors de la connexion:", error);
        // Affichage d'un message d'erreur si les informations de connexion sont incorrectes
        error.style.color = "red";
      });
  });
}
