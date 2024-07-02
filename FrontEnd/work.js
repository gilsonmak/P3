/********************************************** */
// Chargement des données
    getWorks();
    getCategories();
// Récupération des travaux
function getWorks () {
    fetch("http://localhost:5678/api/works")
    .then(result => result.json())
    .then(works => displayWorks(works))
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
function getCategories () {
    fetch("http://localhost:5678/api/categories")
    .then( result => result.json())
    .then(categories => displayCategories(categories))
    console.log(categories)
}
function displayCategories (categories) {
    const filters = document.querySelector(".filters");
    filters.innerHTML ="";
     //creation de la balise button "tous" en dehors de la boucle puisque hors catégorie
     const bouttonFilterTous = document.createElement("button");
     bouttonFilterTous.setAttribute("class", "btn-tous");
     bouttonFilterTous.textContent = "Tous";
     filters.appendChild(bouttonFilterTous)
     // afficher les catégories
    for(let categorie of categories) {
        let buttons = document.createElement("button");
        buttons.innerText = categorie.name;
        console.log(categorie)
        buttons.dataset.categorieId = categorie.id;
        buttons.classList.add("btnFilter");
        filters.appendChild(buttons)
        // Ajout d'un évenement 
        buttons.addEventListener ("click", (event) => {
            console.log(event.target.dataset.categorieId)

        })
    }
}
