// Llama al backend
fetch('http://localhost:3000/api/saludo')
  .then(response => response.json())
  .then(data => {
    document.getElementById('saludo').textContent = data.mensaje;
  })
  .catch(error => {
    console.error('Error al conectar al backend:', error);
    document.getElementById('saludo').textContent = 'No se pudo conectar al backend.';
  });
