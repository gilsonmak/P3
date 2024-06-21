/********************************************** */
// Récupération des données
let workData;
fetch("http://localhost:5678/api/works")
    .then(response =>response.json())
    .then((works) => {
        workData = works;
        console.log(workData);
    })
    .catch((error) => {
        console.error("Erreur lotrs de la récupération des images", error)
    });
let gallery =document.querySelector(".gallery");  

