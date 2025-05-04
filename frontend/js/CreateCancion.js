document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCancion");
  
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get("albumId");
  
    if (!albumId) {
      alert("No se especificó el ID del álbum.");
      return;
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const archivo = document.getElementById("archivo").files[0];
  
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("audio", archivo);
      formData.append("albumId", albumId);
  
      try {
        const response = await fetch("http://localhost:3000/api/canciones/", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Error al registrar la canción.");
        }
  
        alert("Canción registrada exitosamente.");
        form.reset();
      } catch (error) {
        console.error("Error:", error);
        alert("Error al registrar la canción.");
      }
    });
  });
  