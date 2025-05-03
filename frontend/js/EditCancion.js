const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      alert("No se proporcionó el ID de la canción.");
    } else {
      // Obtener datos actuales
      fetch(`http://localhost:3000/api/canciones/${id}`)
        .then(res => res.json())
        .then(data => {
          document.getElementById("nombre").value = data.nombre;
        })
        .catch(err => {
          console.error("Error al cargar la canción:", err);
          alert("No se pudo cargar la canción.");
        });

      // Manejar submit
      document.getElementById("formCancion").addEventListener("submit", e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        fetch(`http://localhost:3000/api/canciones/${id}`, {
          method: "PUT",
          body: formData
        })
        .then(res => {
          if (res.ok) {
            alert("Canción actualizada correctamente.");
            //window.location.href = `listaCanciones.html?albumId=...`; // Coloca el albumId correcto si lo tienes
          } else {
            alert("Error al actualizar la canción.");
          }
        })
        .catch(err => {
          console.error("Error en la actualización:", err);
          alert("Ocurrió un error.");
        });
      });
    }