document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".row.g-4");
  
    fetch("http://localhost:3000/api/generos")
      .then(response => {
        if (!response.ok) throw new Error("Error en la respuesta del servidor");
        return response.json();
      })
      .then(generos => {
        container.innerHTML = "";
  
        generos.forEach(genero => {
          const card = document.createElement("div");
          card.className = "col-6 col-md-4 col-lg-3";
  
          card.innerHTML = `
            <div class="genre-card" ">
              <img src="http://localhost:3000/imagenes/${genero.nombreDeImagen}" alt="${genero.nombre}">
              <h5>${genero.nombre}</h5>
              <div class="d-grid gap-2 mt-3">
                <button class="btn btn-edit-gen" onclick="window.location.href='EditGenero.html?id=${genero.id}'">Editar Género</button>
                <button class="btn btn-ver-artistas" onclick="window.location.href='artistasAdm.html?generoId=${genero.id}'">Ver Artistas</button>
              </div>
            </div>
          `;
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error al cargar los géneros:", error);
        container.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los géneros.</p>`;
      });
  });
  