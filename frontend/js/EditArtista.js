document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const artistaId = params.get("id");
  const form = document.getElementById("formEditarArtista");
  const nombreInput = document.getElementById("nombre");
  const generoSelect = document.getElementById("genero");
  const eliminarBtn = document.getElementById("eliminarBtn");

  let artistaActual = null;

  if (!artistaId) {
    alert("ID de artista no proporcionado.");
    return;
  }

  // 1. Cargar géneros
  fetch("http://localhost:3000/api/generos")
    .then(res => res.json())
    .then(generos => {
      generoSelect.innerHTML = "";
      generos.forEach(g => {
        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = g.nombre;
        generoSelect.appendChild(option);
      });

      // 2. Luego cargar el artista
      return fetch(`http://localhost:3000/api/artistas/${artistaId}`);
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("El artista no existe o fue eliminado.");
      }
      return res.json();
    })
    .then(artista => {
      artistaActual = artista;
      nombreInput.value = artista.nombre;
      generoSelect.value = artista.generoId;

      // Mostrar imagen actual debajo del formulario
      if (artista.nombreDeFoto) {
        const previewContainer = document.createElement('div');
        const imagenPreview = document.createElement('img');
        imagenPreview.src = `http://localhost:3000/imagenes/${artista.nombreDeFoto}`;
        imagenPreview.alt = 'Imagen actual';
        imagenPreview.style.maxWidth = '150px';
        imagenPreview.style.display = 'block';
        imagenPreview.style.marginTop = '10px';
        previewContainer.appendChild(imagenPreview);

        form.insertAdjacentElement('afterend', previewContainer);
      }
    })
    .catch(err => {
      console.error("Error al cargar artista o géneros:", err);
      alert("No se pudo cargar la información.");
    });

  // Envío del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("id", artistaId);

    fetch(`http://localhost:3000/api/artistas/${artistaId}`, {
      method: "PUT",
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al actualizar el artista");
        return res.json();
      })
      .then(data => {
        const nuevoGeneroId = formData.get("generoId");
        window.location.href = `artistasAdm.html?generoId=${nuevoGeneroId}`;
      })
      .catch(err => {
        console.error("Error actualizando artista:", err);
        alert("Hubo un error al actualizar el artista.");
      });
  });

  // Botón de eliminar
  eliminarBtn.addEventListener("click", () => {
    if (!confirm("¿Estás seguro de eliminar este artista?")) return;

    if (!artistaActual) {
      alert("No se pudo obtener la información del artista.");
      return;
    }

    const generoId = artistaActual.generoId;

    fetch(`http://localhost:3000/api/artistas/${artistaId}`, {
      method: "DELETE",
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar el artista");
        alert("Artista eliminado correctamente.");
        setTimeout(() => {
          window.location.href = 'http://127.0.0.1:5500/frontend/home.html';
        }, 0);
      })
      .catch(err => {
        console.error("Error al eliminar el artista:", err);
        alert("No se pudo eliminar el artista.");
      });
  });
});
