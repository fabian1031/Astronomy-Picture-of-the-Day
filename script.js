const API_KEY = "ks4gRBmYAYvgsmSspSk2VefWIeZg0prysdtXnjeo";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

const container = document.getElementById("apodContainer");
const dateInput = document.getElementById("dateInput");
const searchBtn = document.getElementById("searchBtn");
const favBtn = document.getElementById("favBtn");
const favoritesList = document.getElementById("favoritesList");
const loader = document.getElementById("loader");

let currentAPOD = null;

// 🌌 Obtener APOD
async function getAPOD(date = "") {
  try {
    loader.classList.remove("hidden");

    let url = `${BASE_URL}?api_key=${API_KEY}`;
    if (date) url += `&date=${date}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Error en la API");

    const data = await res.json();

    currentAPOD = data;
    renderAPOD(data);

  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    loader.classList.add("hidden");
  }
}

// 🖼️ Renderizar APOD
function renderAPOD(data) {
  container.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>${data.date}</strong></p>
    ${
      data.media_type === "image"
        ? `<img src="${data.url}" alt="${data.title}">`
        : `<iframe width="560" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>`
    }
    <p>${data.explanation}</p>
  `;
}

// 📅 Buscar por fecha
searchBtn.addEventListener("click", () => {
  const selectedDate = dateInput.value;
  const today = new Date().toISOString().split("T")[0];

  if (!selectedDate) {
    alert("Selecciona una fecha");
    return;
  }

  if (selectedDate > today) {
    alert("No puedes seleccionar fechas futuras");
    return;
  }

  getAPOD(selectedDate);
});

// ⭐ Guardar favorito
function saveFavorite(apod) {
  let favorites = getFavorites();

  if (favorites.some(fav => fav.date === apod.date)) {
    alert("Ya está en favoritos");
    return;
  }

  favorites.push(apod);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  renderFavorites();
}

// 📦 Obtener favoritos
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// 📋 Mostrar favoritos
function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = "";

  favorites.forEach((fav, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${fav.date} - ${fav.title}
      <span class="delete-btn">❌</span>
    `;

    // cargar APOD al hacer click
    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      currentAPOD = fav;
      renderAPOD(fav);
    });

    // eliminar favorito
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteFavorite(index);
    });

    favoritesList.appendChild(li);
  });
}

// ❌ Eliminar favorito
function deleteFavorite(index) {
  let favorites = getFavorites();
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// 🖱️ Botón guardar
favBtn.addEventListener("click", () => {
  if (!currentAPOD) {
    alert("No hay APOD cargado");
    return;
  }

  saveFavorite(currentAPOD);
});

// 🚀 Inicial
getAPOD();
renderFavorites();