document.getElementById('formGenero').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData();
  
    const nombre = document.getElementById('nombre').value;
    const imagen = document.getElementById('imagen').files[0];
  
    formData.append('nombre', nombre);
    formData.append('imagen', imagen); 
  
    try {
      const response = await fetch('http://localhost:3000/api/generos', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + errorData.mensaje);
      } else {
        const data = await response.json();
        alert('Género creado correctamente: ' + data.nombre);
        form.reset();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error de conexión al servidor.');
    }
  });
  