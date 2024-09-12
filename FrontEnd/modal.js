//########### Sélection des éléments du DOM ################
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const modalGallery = document.querySelector(".modal-gallery");
const addPhotoButton = document.getElementById("add-photo-button");
const backModal = document.querySelector("#back-modal");
const closeModal = document.querySelector(".close-modal");
const imageFile = document.getElementById("avatar");
const btnValider = document.getElementById("btn-valider");
let imagePreviewed = false;

let dataLoaded = false; // Variable pour vérifier si les données ont déjà été chargées
//################################################################

//####################################################################
//################### Gestion de la modale ############
// Fonction pour afficher et masquer la modale
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

// Retour de la modale
backModal.addEventListener("click", () => {
  // Afficher les éléments
  document.querySelector("#modal1").style.display = "flex";
  // Masquer les éléments
  document.querySelector("#modal2").style.display = "none";
  document.querySelector("#back-modal").style.display = "none";
});

closeModal.addEventListener("click", () => {
  // Afficher les éléments
  document.querySelector("#modal1").style.display = "flex";
  // Masquer les éléments
  document.querySelector("#modal2").style.display = "none";
  document.querySelector("#back-modal").style.display = "none";
});

modalContainer.addEventListener("click", function (event) {
  const modalContent = document.querySelector(".modal");
  if (!modalContent.contains(event.target)) {
    closeModal.click();
    toggleModal();
  }
});
//################################################################

//####################################################################
// Fonction fetch via l'API
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
      imgElement.style.objectFit = "cover";
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
//################################################################

//####################################################################
//################ Suppression des works via l'API #####################
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
//################################################################
// Création du formulaire
const form = document.createElement("form");
form.id = "form-modale";
form.action = "#";
form.method = "post";

const titleLabel = document.createElement("label");
titleLabel.setAttribute("for", "title");
titleLabel.textContent = "Titre";

const titleInput = document.createElement("input");
titleInput.type = "text";
titleInput.name = "title";
titleInput.id = "title";
titleInput.required = true;
titleInput.style.paddingLeft = "15px";
titleInput.style.boxSizing = "border-box";

const selectCategorieDiv = document.createElement("div");
selectCategorieDiv.className = "selectCategorie";

const categorieLabel = document.createElement("label");
categorieLabel.setAttribute("for", "categorie");
categorieLabel.textContent = "Catégorie";

const categorieSelect = document.createElement("select");
categorieSelect.name = "categoryId";
categorieSelect.id = "categorie";
categorieSelect.required = true;
categorieSelect.style.paddingLeft = "15px";
categorieSelect.style.boxSizing = "border-box";

const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.disabled = true;
defaultOption.selected = true;
defaultOption.textContent = "Sélectionnez une catégorie";

categorieSelect.appendChild(defaultOption);
selectCategorieDiv.appendChild(categorieLabel);
selectCategorieDiv.appendChild(categorieSelect);

const erreurSpan = document.createElement("span");
erreurSpan.id = "erreur";
erreurSpan.style.color = "red";

const lineDiv = document.createElement("div");
lineDiv.className = "line";

const sizeErrorMessageElement = document.createElement("div");
sizeErrorMessageElement.id = "file-error";

const typeErrorMessageElement = document.createElement("div");
typeErrorMessageElement.id = "file-type-error-message";

// Append tous les elements du formulaire
form.appendChild(titleLabel);
form.appendChild(titleInput);
form.appendChild(selectCategorieDiv);
form.appendChild(erreurSpan);
form.appendChild(lineDiv);
form.appendChild(sizeErrorMessageElement);
form.appendChild(typeErrorMessageElement);

// Append the form to the body (or any other element)
formAddWork.appendChild(form);

//####################################################################
//############ Gestion du bouton ajouter une photo ##################
// Clique sur le bouton ajouter
addPhotoButton.addEventListener("click", () => {
  resetFormFields(); // Appeler la fonction de réinitialisation avant d'ouvrir la modale
  // Masquer les éléments
  document.querySelector("#modal1").style.display = "none";
  // Afficher les éléments
  document.querySelector("#back-modal").style.display = "block";
  document.querySelector("#modal2").style.display = "flex";
});
//################################################################

//####################################################################
//###################### Gestion pour upload la photo ############
document.getElementById("avatar").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const previewImage = document.getElementById("preview-image");
  const titleInput = document.getElementById("title");
  const sizeErrorMessageElement = document.getElementById("file-error"); // Élément pour afficher les erreurs de taille
  const typeErrorMessageElement = document.getElementById(
    "file-type-error-message"
  );
  // Vider les messages d'erreur avant chaque validation
  sizeErrorMessageElement.innerHTML = "";
  typeErrorMessageElement.innerHTML = "";
  let isValid = true; // Variable pour suivre la validité du fichier

  if (file) {
    const validFileTypes = ["image/jpeg", "image/png"];
    if (!validFileTypes.includes(file.type)) {
      // Vérifier si le type du fichier est valide
      // Afficher un message d'erreur en rouge si le type du fichier est incorrect
      typeErrorMessageElement.textContent =
        "Le fichier doit être de type .jpg ou .png";
      typeErrorMessageElement.style.color = "red";
      typeErrorMessageElement.style.marginBottom = "20px";
      typeErrorMessageElement.style.marginTop = "0px";
      typeErrorMessageElement.style.marginLeft = "auto";
      typeErrorMessageElement.style.marginRight = "auto";
      isValid = false; // Marquer le fichier comme invalide
    }
    // Vérification de la taille du fichier
    if (file.size > 4 * 1024 * 1024) {
      // Limite de taille de fichier à 4 Mo
      // Afficher un message d'erreur en rouge si le fichier est trop volumineux
      sizeErrorMessageElement.textContent =
        "La taille du fichier doit faire moins de 4 Mo";
      sizeErrorMessageElement.style.color = "red";
      sizeErrorMessageElement.style.marginBottom = "20px";
      sizeErrorMessageElement.style.marginTop = "0px";
      sizeErrorMessageElement.style.marginLeft = "auto";
      sizeErrorMessageElement.style.marginRight = "auto";
      isValid = false; // Marquer le fichier comme invalide
    }
    if (isValid) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        document.querySelector(".photo-file i").style.display = "none";
        document.querySelector(".photoAdd").style.display = "none";
        document.querySelector(".photo-size").style.display = "none";
        imagePreviewed = true;
        checkFormCompletion();
      };
      reader.readAsDataURL(file);
      console.log(file);
    }
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
    titleInput.value = "";
    imagePreviewed = false;
    checkFormCompletion();
  }
});
//####################################################################

//####################################################################
//############## Gestion des catégories du formulaire ################
//Fonction pour récupérer les catégories depuis l'API et les placer dans la liste déroulante Catégorie du formulaire
async function fetchCategories() {
  const apiUrl = "http://localhost:5678/api";
  const getCategoriesUrl = `${apiUrl}/categories`;
  try {
    const response = await fetch(getCategoriesUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    return [];
  }
}
//Fonction pour créer les éléments <option> et les ajouter au <select> de la liste déroulante Catégorie du formulaire
async function populateCategoryOptions() {
  const categories = await fetchCategories();
  const categorySelect = document.getElementById("categorie");
  if (categorySelect) {
    // Vider le <select> avant d'ajouter de nouvelles options
    categorySelect.innerHTML =
      '<option value="" disabled selected>Sélectionnez une catégorie</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } else {
    console.error(
      "L'élément <select> avec l'ID 'categorie' n'a pas été trouvé."
    );
  }
}
// Appel de la fonction pour remplir les options de catégories
populateCategoryOptions();
//################################################################

//####################################################################
// Fonction pour vérifier si tous les champs du formulaire sont remplis
function checkFormCompletion() {
  const form = document.getElementById("form-modale");
  const requiredFields = document.querySelectorAll(
    "input[required], select[required]"
  ); // Sélectionne tous les champs requis
  const fileInput = document.querySelector(
    ".modal-new-photo input[type='file']"
  );
  let allFilled = true; // Variable pour suivre si tous les champs sont remplis

  // Vérifier si chaque champ requis est rempli
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false; // Si un champ est vide, on met allFilled à false
    }
    if (!fileInput.files.length) {
      allFilled = false;
    }
  });
  // Si tous les champs sont remplis, activer le bouton et le passer en vert
  if (allFilled) {
    btnValider.disabled = false; // Activer le bouton
    btnValider.style.backgroundColor = "#1d6154"; // Changer la couleur du bouton en vert
    btnValider.style.cursor = "pointer"; // Changer le curseur pour pointer
    erreurSpan.textContent = "";
  } else {
    btnValider.disabled = true; // Désactiver le bouton
    btnValider.style.backgroundColor = ""; // Restaurer la couleur par défaut
    btnValider.style.cursor = "not-allowed"; // Changer le curseur pour montrer que c'est désactivé
    erreurSpan.textContent = "Veuillez remplir tous les champs du formulaire";
    erreurSpan.style.marginBottom = "20px";
    erreurSpan.style.marginTop = "20px";
    erreurSpan.style.marginLeft = "auto";
    erreurSpan.style.marginRight = "auto";
  }
}
// Ajouter un écouteur d'événement pour chaque champ de formulaire pour vérifier la complétion
const formElements = document.querySelectorAll(
  "#form-modale, #form-modale select, #form-modale input, .modal-new-photo input[type='file']"
);
formElements.forEach((element) => {
  element.addEventListener("input", checkFormCompletion);
});
//####################################################################
// Fonction principale pour poster un nouveau projet
// Écouter l'événement de clic sur le bouton "Valider"
btnValider.addEventListener("click", function (event) {
  event.preventDefault(); // Empêche l'envoi immédiat du formulaire

  const fileInput = document.getElementById("avatar");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    // Lorsque l'image est complètement chargée
    reader.onload = function (e) {
      // Afficher l'image dans la modale
      const previewImage = document.getElementById("preview-image");
      previewImage.src = e.target.result;
      previewImage.style.display = "block";

      // Afficher l'image et masquer les éléments inutiles
      document.querySelector(".photo-file i").style.display = "none";
      document.querySelector(".photoAdd").style.display = "none";
      document.querySelector(".photo-size").style.display = "none";

      // Maintenant que l'image est affichée, soumettre le formulaire
      submitForm();
    };

    // Lire l'image pour déclencher `onload`
    reader.readAsDataURL(file);
  } else {
    alert("Veuillez sélectionner une image avant de soumettre le formulaire.");
  }
});

async function submitForm() {
  const formData = new FormData();

  // Ajouter l'image au FormData
  const fileInput = document.getElementById("avatar");
  const file = fileInput.files[0];
  formData.append("image", file);

  // Ajouter les autres champs du formulaire
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("categorie");

  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("L'image et les données ont été envoyées avec succès");

      // Réinitialiser modal2 (vider les champs)
      resetModal(); // Appel à la fonction pour réinitialiser modal2

      // Afficher modal1 et masquer modal2
      document.querySelector("#modal1").style.display = "flex";
      document.querySelector("#modal2").style.display = "none";
      document.querySelector("#back-modal").style.display = "none";

      begin();
      getWorks("All");
    } else {
      console.error("Erreur lors de l'envoi des données", response.status);
      alert("Une erreur est survenue lors de l'envoi de vos données.");
    }
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
    alert("Une erreur réseau est survenue. Veuillez réessayer plus tard.");
  }
}

// Fonction pour réinitialiser tous les champs du formulaire
function resetFormFields() {
  // Réinitialiser tous les champs input
  document.querySelectorAll("#form-modale input").forEach((input) => {
    input.value = "";
  });

  // Réinitialiser les champs select
  document.querySelectorAll("#form-modale select").forEach((select) => {
    select.selectedIndex = 0; // Réinitialise au premier élément (l'option par défaut)
  });

  // Réinitialiser les champs de fichier
  const fileInput = document.querySelector(
    ".modal-new-photo input[type='file']"
  );
  if (fileInput) {
    fileInput.value = ""; // Vider le champ de fichier
  }

  // Cacher l'image d'aperçu et restaurer les éléments masqués
  const previewImage = document.getElementById("preview-image");
  if (previewImage) {
    previewImage.src = ""; // Supprimer la source de l'image
    previewImage.style.display = "none"; // Masquer l'aperçu de l'image
  }

  // Restaurer les éléments de la zone d'upload
  document.querySelector(".photo-file i").style.display = "block";
  document.querySelector(".photoAdd").style.display = "block";
  document.querySelector(".photo-size").style.display = "block";

  // Réinitialiser le message d'erreur s'il existe
  document.getElementById("file-error").innerHTML = "";
  document.getElementById("file-type-error-message").innerHTML = "";

  // Désactiver le bouton "Valider" à nouveau
  const btnValider = document.getElementById("btn-valider");
  btnValider.disabled = true; // Désactiver le bouton
  btnValider.style.backgroundColor = ""; // Restaurer la couleur par défaut
  btnValider.style.cursor = "not-allowed"; // Changer le curseur pour montrer que c'est désactivé

  // Vider le message d'erreur de formulaire
  document.getElementById("erreur").textContent = "";
}

// Fonction pour réinitialiser modal2 (vider les champs de formulaire)
function resetModal() {
  const form = document.getElementById("form-modale");
  form.reset(); // Réinitialise tous les champs du formulaire

  // Réinitialiser l'aperçu d'image
  const previewImage = document.getElementById("preview-image");
  previewImage.src = "";
  previewImage.style.display = "none";

  // Réafficher les éléments d'ajout de photo
  document.querySelector(".photo-file i").style.display = "block";
  document.querySelector(".photoAdd").style.display = "block";
  document.querySelector(".photo-size").style.display = "block";

  // Réinitialiser l'état d'image prévisualisée
  imagePreviewed = false;
}
