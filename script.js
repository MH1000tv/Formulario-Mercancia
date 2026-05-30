document.addEventListener('DOMContentLoaded', () => {
    const fechaInput = document.getElementById('fechaSolicitud');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
});

const formulario = document.getElementById('miFormulario');
const modalEstado = document.getElementById('modalEstado');
const modalIcono = document.getElementById('modalIcono');
const modalMensaje = document.getElementById('modalMensaje');
const btnModalAceptar = document.getElementById('btnModalAceptar');

const contenedorProductos = document.getElementById('contenedorProductos');
const btnAgregarProducto = document.getElementById('btnAgregarProducto');

let contadorProductos = 1;

// Escuchar evento para añadir un nuevo bloque de producto
btnAgregarProducto.addEventListener('click', () => {
    contadorProductos++;
    
    const nuevoBloque = document.createElement('div');
    nuevoBloque.classList.add('bloque-producto');
    nuevoBloque.innerHTML = `
        <div class="producto-header-interno">
            <span class="producto-numero">Producto #${contadorProductos}</span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Producto</label>
                <input type="text" class="input-producto" placeholder="Nombre del producto" required>
            </div>
            <div class="form-group">
                <label>Referencia</label>
                <input type="text" class="input-referencia" placeholder="Código o referencia" required>
            </div>
            <div class="form-group cantidad-group">
                <label>Cantidad</label>
                <input type="number" class="input-cantidad" min="1" placeholder="0" required>
            </div>
        </div>
        <div class="form-group">
            <label>Características del Insumo</label>
            <input type="text" class="input-caracteristica" placeholder="Color, tamaño, material, etc." required>
        </div>
        
        <div class="producto-footer-interno">
            <button type="button" class="btn-eliminar-prod">Eliminar</button>
        </div>
    `;
    
    contenedorProductos.appendChild(nuevoBloque);
    
    // Lógica para borrar este bloque específico
    nuevoBloque.querySelector('.btn-eliminar-prod').addEventListener('click', () => {
        nuevoBloque.remove();
        reindexarProductos();
    });
});

// Función para reorganizar los números (Producto #1, #2...) si se borra alguno intermedio
function reindexarProductos() {
    const bloques = contenedorProductos.querySelectorAll('.bloque-producto');
    contadorProductos = 0;
    bloques.forEach((bloque) => {
        contadorProductos++;
        bloque.querySelector('.producto-numero').innerText = `Producto #${contadorProductos}`;
    });
}

// URL DE TU GOOGLE APPS SCRIPT
const URL_GOOGLE_API = "https://script.google.com/macros/s/AKfycbzoD-VqFvMvEpvuWJqZXUOJEfXcU1qvUHnHnGp9SoC4PzNAKbkxVw3Y5cTHCk1-NjAbNA/exec";

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    modalIcono.innerText = "🚚";
    modalMensaje.innerText = "Enviando formulario, por favor espere...";
    btnModalAceptar.style.display = "none";
    modalEstado.classList.add('active');

    // 1. Recolectar datos generales del encabezado
    const fechaSolicitud = document.getElementById('fechaSolicitud').value;
    const agencia = document.getElementById('agencia').value;
    const solicitadoPor = document.getElementById('solicitadoPor').value;
    const proveedor = document.getElementById('proveedor').value;
    const contactoProveedor = document.getElementById('contactoProveedor').value;
    const justificacion = document.getElementById('justificacion').value;

    // 2. Recolectar todos los productos agregados en una lista (Array)
    const listaProductos = [];
    const bloques = contenedorProductos.querySelectorAll('.bloque-producto');
    
    bloques.forEach(bloque => {
        listaProductos.push({
            producto: bloque.querySelector('.input-producto').value,
            referencia: bloque.querySelector('.input-referencia').value,
            cantidad: bloque.querySelector('.input-cantidad').value,
            caracteristica: bloque.querySelector('.input-caracteristica').value
        });
    });

    // 3. Empaquetar todo para el envío de datos
    const datosParaEnviar = new URLSearchParams();
    datosParaEnviar.append('fechaSolicitud', fechaSolicitud);
    datosParaEnviar.append('agencia', agencia);
    datosParaEnviar.append('solicitadoPor', solicitadoPor);
    datosParaEnviar.append('proveedor', proveedor);
    datosParaEnviar.append('contactoProveedor', contactoProveedor);
    datosParaEnviar.append('justificacion', justificacion);
    // Convertimos la lista de productos a un texto JSON stringificado para enviarlo de forma compacta
    datosParaEnviar.append('productosJSON', JSON.stringify(listaProductos));

    fetch(URL_GOOGLE_API, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: datosParaEnviar.toString()
    })
    .then(() => {
        modalIcono.innerText = "✅";
        modalMensaje.innerText = "Formulario enviado con éxito";
        btnModalAceptar.style.display = "inline-block";
    })
    .catch(error => {
        console.error('Error:', error);
        modalIcono.innerText = "❌";
        modalMensaje.innerText = "Hubo un error al enviar la solicitud. Intenta de nuevo.";
        btnModalAceptar.style.display = "inline-block";
    });
});

btnModalAceptar.addEventListener('click', () => {
    modalEstado.classList.remove('active');
    formulario.reset();
    
    // Resetear el contenedor dinámico para dejar solo el primer producto limpio
    contenedorProductos.innerHTML = `
        <div class="bloque-producto">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span class="producto-numero" style="color: #fff; font-weight: 600; font-size: 14px;">Producto #1</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Producto</label>
                    <input type="text" class="input-producto" placeholder="Nombre del producto" required>
                </div>
                <div class="form-group">
                    <label>Referencia</label>
                    <input type="text" class="input-referencia" placeholder="Código o referencia" required>
                </div>
                <div class="form-group cantidad-group">
                    <label>Cantidad</label>
                    <input type="number" class="input-cantidad" min="1" placeholder="0" required>
                </div>
            </div>
            <div class="form-group">
                <label>Características del Insumo</label>
                <input type="text" class="input-caracteristica" placeholder="Color, tamaño, material, etc." required>
            </div>
        </div>
    `;
    contadorProductos = 1;

    const fechaInput = document.getElementById('fechaSolicitud');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
});