let albumes = [];
let albumActualIndex = 0;
let modalBootstrap = null; // ← Solo una instancia del modal

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const artistaId = params.get("artistaId");
  const albumesContainer = document.getElementById("albumesContainer");
  modalBootstrap = new bootstrap.Modal(document.getElementById("albumModal")); // ← Instanciamos una vez

  try {
    const res = await fetch(`http://localhost:3000/api/albumes/artista/${artistaId}`);
    albumes = await res.json();

    albumes.forEach((album, index) => {
      const card = document.createElement("div");
      card.className = "card mx-2";
      card.style.width = "200px";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <img src="http://localhost:3000/imagenes/${album.imagen}" class="card-img-top" alt="${album.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${album.nombre}</h5>
        </div>
      `;

      card.addEventListener("click", () => {
        albumActualIndex = index;
        abrirModal(albumActualIndex, true); // true: mostrar modal
      });

      albumesContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error cargando álbumes:", err);
  }
});

async function abrirModal(index, mostrar = false) {
  const album = albumes[index];
  const modalImagen = document.getElementById("modalAlbumImagen");
  const modalTitulo = document.getElementById("modalAlbumTitulo");
  const listaCanciones = document.getElementById("listaCanciones");
  const audioPlayer = document.getElementById("audioPlayer");
  const flechasContainer = document.getElementById("flechasContainer");

  // Actualizar contenido
  modalImagen.src = `http://localhost:3000/imagenes/${album.imagen}`;
  modalTitulo.textContent = album.nombre;
  listaCanciones.innerHTML = "";
  audioPlayer.src = "";

  try {
    const res = await fetch(`http://localhost:3000/api/canciones/album/${album.id}`);
    const canciones = await res.json();

    canciones.forEach(cancion => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = cancion.nombre;
      li.style.cursor = "pointer";

      li.addEventListener("click", () => {
        audioPlayer.src = `http://localhost:3000/audio/${cancion.archivo}`;
        audioPlayer.play();
      });

      listaCanciones.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando canciones:", err);
  }

  // Mostrar u ocultar flechas
  flechasContainer.innerHTML = `
    <button class="btn btn-outline-dark me-2" ${index === 0 ? "disabled" : ""} onclick="cambiarAlbum(-1)">←</button>
    <button class="btn btn-outline-dark" ${index === albumes.length - 1 ? "disabled" : ""} onclick="cambiarAlbum(1)">→</button>
  `;

  if (mostrar) {
    modalBootstrap.show(); // Solo mostrar si se invoca desde click
  }
}

function cambiarAlbum(direccion) {
  const nuevoIndex = albumActualIndex + direccion;

  if (nuevoIndex >= 0 && nuevoIndex < albumes.length) {
    albumActualIndex = nuevoIndex;
    abrirModal(albumActualIndex, false); // No mostrar nuevamente
  }
}
