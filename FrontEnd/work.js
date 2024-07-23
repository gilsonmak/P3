/***********************************************/
// Chargement des données
getWorks("All");
getCategories();
// Récupération des travaux via l'API
function getWorks(categorieId) {
  fetch("http://localhost:5678/api/works")
    .then((result) => result.json())
    .then((works) => displayWorks(works, categorieId));
}
// Affichage des travaux
function displayWorks(works, categorieId) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let work of works) {
    if (categorieId != "All" && categorieId != work.categoryId) {
      continue;
    }
    let figureElement = document.createElement("figure");
    // Création de l'image
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    figureElement.appendChild(imgElement);
    // Création de la légende
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = work.title;
    figureElement.appendChild(figcaptionElement);
    // Ajout de la figure dans la gallery
    gallery.appendChild(figureElement);
  }
}
// Récupération des travaux par catégorie via l'API
function getCategories() {
  fetch("http://localhost:5678/api/categories")
    .then((result) => result.json())
    .then((categories) => displayCategories(categories));
}
// Affichage des catégories
function displayCategories(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";
  //creation de la balise button "tous" en dehors de la boucle puisque hors catégorie
  const bouttonFilterAll = document.createElement("button");
  bouttonFilterAll.setAttribute("class", "btn-tous");
  bouttonFilterAll.textContent = "Tous";
  bouttonFilterAll.dataset.categorieId = "All";
  // Ajout d'un évenement
  bouttonFilterAll.addEventListener("click", () => {
    getWorks("All");
  });
  filters.appendChild(bouttonFilterAll);
  // affichage les filtres par catégories
  for (let categorie of categories) {
    let buttons = document.createElement("button");
    buttons.innerText = categorie.name;
    console.log(categorie);
    buttons.dataset.categorieId = categorie.id;
    buttons.classList.add("btnFilter");
    buttons.addEventListener("click", (event) => {
      getWorks(event.target.dataset.categorieId);
    });
    filters.appendChild(buttons);
  }
}
const authToken = localStorage.getItem("authToken");
const editMode = document.getElementById("edit-mode");
const editButton = document.getElementById("edit-button");
const logOut = document.getElementById("login-btn");
const filters = document.getElementById("filters");
// Afficher les éléments en mode édition si un token d'authentification est présent
if (authToken) {
  editMode.style.display = "flex";
  editButton.style.display = "flex";
  filters.style.display = "none";
  logOut.textContent = "logout";
} else {
  logOut.textContent = "login";
}
// Pour la déconnexion
logOut.addEventListener("click", function () {
  if (authToken) {
    localStorage.removeItem("authToken");
    location.reload();
  } else {
    console.error("Un ou plusieurs éléments du DOM n'ont pas été trouvés.");
  }
});
