document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get("albumId");
  
    if (!albumId) {
      alert("No se proporcionó un albumId. Serás redirigido.");
      window.location.href = "homeAdm.html";
      return;
    }
  
    document.getElementById('formAlbum').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById('nombre').value.trim();
      const imagen = document.getElementById('imagen').files[0];
      console.log('Album ID:', albumId);
  
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('albumId', albumId);
      if (imagen) formData.append('imagen', imagen);
  
      try {
        const response = await fetch(`http://localhost:3000/api/albumes/${albumId}`, {
          method: 'PUT',
          body: formData
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Error al registrar el álbum.');
        }
  
        alert('Álbum registrado con éxito.');
        // window.location.href = 'lista_artistas.html';
      } catch (error) {
        console.error('Error al registrar el álbum:', error);
        alert('No se pudo registrar el álbum.');
      }
    });
  });
  