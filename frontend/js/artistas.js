document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const generoId = params.get("generoId");
  const container = document.getElementById("artistasContainer");

  if (!generoId) {
    container.innerHTML = `<p class="text-danger">ID de género no proporcionado.</p>`;
    return;
  }

  fetch(`http://localhost:3000/api/artistas/genero/${generoId}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener artistas");
      return res.json();
    })
    .then(artistas => {
      container.innerHTML = "";

      if (artistas.length === 0) {
        container.innerHTML = `<p class="text-center">No hay artistas para este género.</p>`;
        return;
      }

      artistas.forEach(artista => {
        const div = document.createElement("div");
        div.className = "col-12 col-md-6 col-lg-4";

        div.innerHTML = ` 
        <div class="genre-card h-100">
        <img src="http://localhost:3000/imagenes/${artista.nombreDeFoto}" alt="${artista.nombre}">
        <h5>${artista.nombre}</h5>
        <p><strong>Género:</strong> ${artista.genero.nombre}</p>
        </div>
        `;

        div.querySelector(".genre-card").addEventListener("click", () => {
          window.location.href = `albums.html?artistaId=${artista.id}`;
        });
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p class="text-danger">Error al cargar los artistas.</p>`;
    });
});
