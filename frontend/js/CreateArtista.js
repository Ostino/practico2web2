document.addEventListener('DOMContentLoaded', async () => {
    const generoSelect = document.getElementById('genero');
  
    try {
      const response = await fetch('http://localhost:3000/api/generos');
      if (!response.ok) throw new Error('Error al cargar géneros');
  
      const generos = await response.json();
      generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id; 
        option.textContent = genero.nombre;
        generoSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando géneros:', error);
      alert('No se pudieron cargar los géneros musicales');
    }
  });
  document.getElementById('formArtista').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const nombre = document.getElementById('nombre').value.trim();
    const generoId = document.getElementById('genero').value;
    const imagen = document.getElementById('imagen').files[0];
  
    if (!generoId) {
      alert('Por favor, selecciona un género.');
      return;
    }
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('generoId', generoId);
    if (imagen) formData.append('imagen', imagen);
  
    try {
      const response = await fetch('http://localhost:3000/api/artistas', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar el artista.');
      }
  
      alert('Artista registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el artista:', error);
      alert('No se pudo registrar el artista.');
    }
  });