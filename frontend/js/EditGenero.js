document.addEventListener('DOMContentLoaded', async () => {
    const generoId = new URLSearchParams(window.location.search).get('id');
  
    if (!generoId) {
      alert('ID del género no especificado.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/generos/${generoId}`);
      if (!response.ok) throw new Error('Error al obtener los datos del género.');
  
      const genero = await response.json();
      document.getElementById('nombre').value = genero.nombre;
  
      const previewContainer = document.createElement('div');
      const imagenPreview = document.createElement('img');
      imagenPreview.src = `http://localhost:3000/imagenes/${genero.nombreDeImagen}`;
      imagenPreview.alt = 'Imagen actual';
      imagenPreview.style.maxWidth = '150px';
      imagenPreview.style.display = 'block';
      imagenPreview.style.marginTop = '10px';
      previewContainer.appendChild(imagenPreview);
  
      document.getElementById('formGenero').appendChild(previewContainer);
  
    } catch (error) {
      console.error('Error al cargar el género:', error);
      alert('Error al cargar los datos del género.');
    }
  
    document.getElementById('formGenero').addEventListener('submit', async function (e) {
      e.preventDefault();
    
      const nombre = document.getElementById('nombre').value.trim();
      const imagen = document.getElementById('imagen').files[0];
    
      const formData = new FormData();
      formData.append('nombre', nombre);
      if (imagen) formData.append('imagen', imagen);
    
      try {
        const response = await fetch(`http://localhost:3000/api/generos/${generoId}`, {
          method: 'PUT',
          body: formData
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          alert('Error al actualizar: ' + errorData.mensaje);
          return;
        }
    
        const data = await response.json();
        alert('Género actualizado correctamente: ' + data.nombre);
    
        // Asegura la redirección después del alert
        setTimeout(() => {
          window.location.href = 'http://127.0.0.1:5500/frontend/home.html';
        }, 0);
    
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Error de conexión al servidor.');
      }
    });
    
  });
  document.getElementById('eliminarBtn').addEventListener('click', async () => {
    const generoId = new URLSearchParams(window.location.search).get('id');
  
    if (!generoId) {
      alert('ID del género no especificado.');
      return;
    }
  
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este género? Esta acción no se puede deshacer.');
    if (!confirmar) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/generos/${generoId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error al eliminar: ' + (errorData.mensaje || ''));
        return;
      }
  
      alert('Género eliminado correctamente.');
  
      // Asegura redirección luego del alert
      setTimeout(() => {
        window.location.href = 'http://127.0.0.1:5500/frontend/home.html';
      }, 0);
  
    } catch (error) {
      console.error('Error al eliminar el género:', error);
      alert('Error de conexión al servidor.');
    }
  });
  
  