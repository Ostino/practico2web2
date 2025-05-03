document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaCanciones");
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get("albumId");

    if (!albumId) {
      lista.innerHTML = "<li class='list-group-item'>No se especificó un álbum.</li>";
      return;
    }

    fetch(`http://localhost:3000/api/canciones/album/${albumId}`)
      .then(res => res.json())
      .then(canciones => {
        if (canciones.length === 0) {
          lista.innerHTML = "<li class='list-group-item'>No hay canciones registradas.</li>";
          return;
        }

        canciones.forEach(cancion => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.innerHTML = `
            <span>${cancion.nombre}</span>
            <div>
              <button class="btn btn-sm btn-warning me-2" onclick="editarCancion(${cancion.id})">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="eliminarCancion(${cancion.id})">Eliminar</button>
            </div>
          `;
          lista.appendChild(li);
        });
      })
      .catch(err => {
        console.error("Error al cargar canciones:", err);
        lista.innerHTML = "<li class='list-group-item text-danger'>Error al cargar canciones.</li>";
      });
  });

  function editarCancion(id) {
    window.location.href = `editCancion.html?id=${id}`;
  }

  function eliminarCancion(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta canción?")) {
      fetch(`http://localhost:3000/api/canciones/${id}`, {
        method: "DELETE"
      })
      .then(res => {
        if (res.ok) {
          location.reload();
        } else {
          alert("Error al eliminar la canción.");
        }
      });
    }
  }