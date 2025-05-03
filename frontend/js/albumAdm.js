document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const artistaId = params.get("artistaId");
    const container = document.getElementById("container");
  
    if (!artistaId) {
      alert("artistaId no proporcionado en la URL.");
      window.location.href = "home.html";
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/albumes/artista/${artistaId}`);
      if (!response.ok) throw new Error("No se pudieron obtener los álbumes.");
  
      const albumes = await response.json();
  
      if (albumes.length === 0) {
        container.innerHTML = "<p>No hay álbumes para este artista.</p>";
        return;
      }
  
      albumes.forEach(album => {
        const div = document.createElement("div");
        div.className = "col-12 col-md-6 col-lg-4";
  
        div.innerHTML = ` 
          <div class="genre-card h-100">
            <img src="http://localhost:3000/imagenes/${album.imagen}" alt="${album.nombre}" class="img-fluid">
            <h5>${album.nombre}</h5>
            <div class="d-grid gap-2 mt-3">
            <button class="btn btn-primary" onclick="window.location.href='editalbum.html?albumId=${album.id}'">Editar Album</button>
            <button class="btn btn-secondary" onclick="window.location.href='cancionAdm.html?albumId=${album.id}'">Ver Canciones</button>
            <button class="btn btn-secondary" onclick="window.location.href='CreateCancion.html?albumId=${album.id}'">Añadir Canciones</button>
            </div>
          </div>
        `;
  
        container.appendChild(div);
      });
  
    } catch (err) {
      console.error("Error al cargar álbumes:", err);
      container.innerHTML = "<p>No hay albums que mostrar.</p>";
    }
  });
  