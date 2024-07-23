document.addEventListener("DOMContentLoaded"),
  function () {
    const authToken = localStorage.getItem("authToken");
    const editMode = document.getElementById("edit-mode");
    const logOut = document.getElementById("login-btn");
    const filters = document.getElementById("filters");
    if (authToken) {
      editMode.style.display = null;
      filters.style.display = "none";
      logOut.textContent = "logout";
    }
    logOut.addEventListener("click", function () {
      if (authToken) {
        localStorage.removeItem("authToken");
        location.reload();
      }
    });
  };
