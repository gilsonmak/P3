/********************************************** */
init ()
function init () {
    getWorks();  
}
let gallery =document.querySelector(".gallery");
// Récupération des travaux
function getWorks () {
    fetch("http://localhost:5678/api/works")
    .then(result=>result.json())
    .then(works=>displayWorks(works))
}