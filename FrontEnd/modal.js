const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGallery = document.querySelector(".modal-gallery");
const addPhotoButton = document.querySelector("#add-photo-button");
let dataLoaded = false;
// Définition de la fonction toggleModal
function toggleModal() {
  if (!dataLoaded) {
    begin();
    dataLoaded = true;
  }
  modalContainer.classList.toggle("active");
}
// Ajout de l'écouteur d'événement de clic à chaque modal trigger
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", toggleModal);
});
// Fonction feetch via l'API
async function begin() {
  try {
    let response = await fetch("http://localhost:5678/api/works");
    let data = await response.json();
    console.log(data);
    modalGallery.innerHTML = "";
    for (let work of data) {
      let figureElement = document.createElement("figure");
      // Création de l'image
      const imgElement = document.createElement("img");
      imgElement.src = work.imageUrl;
      figureElement.appendChild(imgElement);
      // Création de la poubelle pour suppression
      const logoSupp = document.createElement("div");
      logoSupp.classList.add("fond-icone");
      let icon = document.createElement("i");
      icon.classList.add("fa-solid");
      icon.classList.add("fa-trash-can");
      logoSupp.appendChild(icon);
      logoSupp.id = "suppPhoto";
      logoSupp.dataset.workId = work.id;
      figureElement.appendChild(logoSupp);
      // Ajout de la figure dans la gallery
      modalGallery.appendChild(figureElement);
    }
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}
addPhotoButton.addEventListener("click", () => {
  console.log(" le bouton a été cliqué !!!!");
});
