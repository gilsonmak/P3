/********************************************** */
// Chargement des données
init()
function init() {
    getWorks();
    getCategories();
}
// Récupération des travaux
function getWorks () {
    fetch("http://localhost:5678/api/works")
    .then(result=>result.json())
    .then(works=>displayWorks(works))
}
// Affichage des travaux
function displayWorks (works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML ="";
    for (let work of works) {
        let figureElement = document.createElement("figure");
// Création de l'image
        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;
        figureElement.appendChild(imgElement);
// Création de la légende
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerText = work.title;
        figureElement.appendChild(figcaptionElement)
// Ajout de la figure dans la gallery
       gallery.appendChild(figureElement)
    }
}

// Récupération des travaux par catégorie via l'API
//function getCategories () {
    fetch("http://localhost:5678/api/categories")
    .then(result =>result.json())
    .then(categories=>displayCategories(categories))

