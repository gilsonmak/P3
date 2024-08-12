const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGallery = document.querySelector(".modal-gallery");
const addPhotoButton = document.querySelector("#add-photo-button");
const backModal = document.querySelector("#back-modal");
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

      // Ajout de l'écouteur de click pour suppression
      logoSupp.addEventListener("click", async (event) => {
        event.preventDefault();
        const workId = event.currentTarget.dataset.workId;
        await deleteWork(workId, figureElement);
      });
      figureElement.appendChild(logoSupp);
      // Ajout de la figure dans la gallery
      modalGallery.appendChild(figureElement);
    }
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}
// Fonction pour supprimer un work via l'API
async function deleteWork(workId, workElement) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.log("Erreur : Accès non autorisé à l'API 'delete'");
    return;
  }
  try {
    let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      console.log(`L'objet avec l'id ${workId} a été supprimé.`);
      begin();
      getWorks("All");
    } else {
      console.error(
        `Erreur de suppression pour l'objet avec l'id ${workId}:`,
        response.status
      );
    }
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'objet avec l'id ${workId}:`,
      error
    );
  }
}

addPhotoButton.addEventListener("click", () => {
  // Masquer les éléments
  document.querySelector(".modal-gallery").style.display = "none";
  document.querySelector(".modal h3").style.display = "none";
  document.querySelector("#add-photo-button").style.display = "none";

  // Afficher les éléments
  document.querySelector("#back-modal").style.display = "block";
  document.querySelector(".modal-h3").style.display = "block";
  document.querySelector(".modal-new-photo").style.display = "block";
  document.querySelector(".modal-new-category").style.display = "flex";
  document.querySelector(".selectCategorie").style.display = "block";
  document.querySelector("#btn-valider").style.display = "block";
});

document.querySelector(".photo-file").addEventListener("click", () => {
  document.querySelector("#avatar").click();
});
backModal.addEventListener("click", () => {
  // Afficher les éléments
  document.querySelector(".modal-gallery").style.display = "flex";
  document.querySelector(".modal h3").style.display = "flex";
  document.querySelector("#add-photo-button").style.display = "flex";

  // Masquer les éléments
  document.querySelector("#back-modal").style.display = "none";
  document.querySelector(".modal-h3").style.display = "none";
  document.querySelector(".modal-new-photo").style.display = "none";
  document.querySelector(".modal-new-category").style.display = "none";
  document.querySelector(".selectCategorie").style.display = "none";
  document.querySelector("#btn-valider").style.display = "none";
});
