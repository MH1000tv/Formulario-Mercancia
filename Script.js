document.addEventListener('DOMContentLoaded', () => {
    // Asignar la fecha actual automáticamente al cargar la página
    const fechaInput = document.getElementById('fechaSolicitud');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
});

// Capturar elementos del DOM para la ventana modal y el formulario
const formulario = document.getElementById('miFormulario');
const modalEstado = document.getElementById('modalEstado');
const modalIcono = document.getElementById('modalIcono');
const modalMensaje = document.getElementById('modalMensaje');
const btnModalAceptar = document.getElementById('btnModalAceptar');

// URL COMPLETA DE TU API WEB EN GOOGLE APPS SCRIPT
const URL_GOOGLE_API = "https://script.google.com/macros/s/AKfycbzoD-VqFvMvEpvuWJqZXUOJEfXcU1qvUHnHnGp9SoC4PzNAKbkxVw3Y5cTHCk1-NjAbNA/exec";

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar que la página se recargue de forma nativa

    // 1. Mostrar la animación del camión de carga 🚚 en el modal
    modalIcono.innerText = "🚚";
    modalMensaje.innerText = "Enviando formulario, por favor espere...";
    btnModalAceptar.style.display = "none";
    modalEstado.classList.add('active');

    // 2. Mapear y empaquetar los datos en el formato x-www-form-urlencoded
    const datosParaEnviar = new URLSearchParams();
    datosParaEnviar.append('fechaSolicitud', document.getElementById('fechaSolicitud').value);
    datosParaEnviar.append('agencia', document.getElementById('agencia').value);
    datosParaEnviar.append('solicitadoPor', document.getElementById('solicitadoPor').value);
    datosParaEnviar.append('proveedor', document.getElementById('proveedor').value);
    datosParaEnviar.append('contactoProveedor', document.getElementById('contactoProveedor').value);
    datosParaEnviar.append('producto', document.getElementById('producto').value);
    datosParaEnviar.append('referencia', document.getElementById('referencia').value);
    datosParaEnviar.append('cantidad', document.getElementById('cantidad').value);
    datosParaEnviar.append('caracteristica', document.getElementById('caracteristica').value);
    datosParaEnviar.append('justificacion', document.getElementById('justificacion').value);

    // 3. Enviar los datos estructurados a la API usando 'no-cors' para omitir restricciones del navegador
    fetch(URL_GOOGLE_API, {
        method: 'POST',
        mode: 'no-cors', // Evita que las redirecciones de Google rompan el flujo en el navegador
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: datosParaEnviar.toString()
    })
    .then(() => {
        // En modo no-cors la respuesta llega vacía, pero si entra aquí es porque fue enviada con éxito
        modalIcono.innerText = "✅";
        modalMensaje.innerText = "Formulario enviado con éxito";
        btnModalAceptar.style.display = "inline-block";
    })
    .catch(error => {
        console.error('Error detectado al enviar:', error);
        modalIcono.innerText = "❌";
        modalMensaje.innerText = "Hubo un error al enviar la solicitud. Intenta de nuevo.";
        btnModalAceptar.style.display = "inline-block";
    });
});

// Acción del botón Aceptar del modal (reiniciar formulario y limpiar campos)
btnModalAceptar.addEventListener('click', () => {
    modalEstado.classList.remove('active');
    formulario.reset();
    
    // Reasignar la fecha de hoy por defecto tras limpiar todos los inputs del formulario
    const fechaInput = document.getElementById('fechaSolicitud');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
});