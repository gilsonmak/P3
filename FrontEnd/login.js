login();
function login () {
    const logForm = document.getElementById("form-login");
    logForm.addEventListener("submit", function(event) {
        event.preventDefault();
    // création de l'objet user
        const user = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
    // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(user);
    // Appel de la fonction fetch
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    })
}