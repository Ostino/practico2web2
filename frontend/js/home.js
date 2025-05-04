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
          if (genero.id === 7) return;
          const card = document.createElement("div");
          card.className = "col-6 col-md-4 col-lg-3";
  
          card.innerHTML = `
            <div class="genre-card" style="cursor: pointer;">
              <img src="http://localhost:3000/imagenes/${genero.nombreDeImagen}" alt="${genero.nombre}">
              <h5>${genero.nombre}</h5>
            </div>
          `;
  
          card.querySelector(".genre-card").addEventListener("click", () => {
            window.location.href = `artistas.html?generoId=${genero.id}`;
          });
  
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Error al cargar los artistas:", error);
        container.innerHTML = `<p class="text-danger text-center">No se pudieron cargar los artistas.</p>`;
      });
  });
  