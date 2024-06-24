/********************************************** */
init()
function init() {
    getWorks();  
}
// Récupération des travaux
function getWorks () {
    fetch("http://localhost:5678/api/works")
    .then(result=>result.json())
    .then(works=>displayWorks(works))
}
// appeler la fonction pour afficher les travaux
function displayWorks (works) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "";
    for(let work of works) {
        let figure = document.createElement("figure");
        figure.dataset.categoryId = work.categoryId
        let img = document.createElement("img");
        img.setAttribute("src",work.imageUrl);
        img.setAttribute("alt",work.title);
        let figCaption = document.createElement("figcaption");
        figCaption.innerText = work.title;
        figure.append(img);
        figure.append(figCaption);
          // gallery.append(figure);
        console.log(figure);
        document.querySelector(".gallery").append(figure); 



        

    }


}