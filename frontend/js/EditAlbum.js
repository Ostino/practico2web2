document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const albumId = params.get("albumId");

  if (!albumId) {
    alert("No se proporcionó un albumId. Serás redirigido.");
    window.location.href = "homeAdm.html";
    return;
  }

  // Obtener datos del álbum y autocompletar el formulario
  try {
    const response = await fetch(`http://localhost:3000/api/albumes/${albumId}`);
    if (!response.ok) throw new Error("No se pudo obtener el álbum");

    const data = await response.json();
    document.getElementById('nombre').value = data.nombre;

    // Mostrar imagen actual con tu método
    if (data.imagen) {
      const previewContainer = document.createElement('div');
      const imagenPreview = document.createElement('img');
      imagenPreview.src = `http://localhost:3000/imagenes/${data.imagen}`;
      imagenPreview.alt = 'Imagen actual';
      imagenPreview.style.maxWidth = '150px';
      imagenPreview.style.display = 'block';
      imagenPreview.style.marginTop = '10px';
      previewContainer.appendChild(imagenPreview);

      const form = document.getElementById('formAlbum');
form.appendChild(previewContainer);
    }
  } catch (error) {
    console.error('Error al cargar el álbum:', error);
    alert('No se pudo cargar la información del álbum.');
  }

  // Enviar actualización del álbum
  document.getElementById('formAlbum').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const imagen = document.getElementById('imagen').files[0];

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
        throw new Error(errorText || 'Error al actualizar el álbum.');
      }

      alert('Álbum actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar el álbum:', error);
      alert('No se pudo actualizar el álbum.');
    }
  });
  document.getElementById('eliminarBtn').addEventListener('click', async () => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este álbum? Esta acción no se puede deshacer.");
    if (!confirmacion) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/albumes/${albumId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar el álbum.');
      }
  
      alert('Álbum eliminado con éxito.');
      window.location.href = 'homeAdm.html'; // Cambia esto si deseas redirigir a otra página
    } catch (error) {
      console.error('Error al eliminar el álbum:', error);
      alert('No se pudo eliminar el álbum.');
    }
  });
});
