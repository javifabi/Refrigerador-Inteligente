// =============================
// TEMPERATURA
// =============================

let temperatura = 4;

function bajarTemperatura() {
    if (!conectado) {
        mostrarAlertaConexion();
        return;
    }

    if (temperatura > -5) {
        temperatura--;
        actualizarTemperatura();

        registrarEvento(
            "Temperatura disminuida a " + temperatura + " °C"
        );
    }
}

function subirTemperatura() {
    if (!conectado) {
        mostrarAlertaConexion();
        return;
    }

    if (temperatura < 15) {
        temperatura++;
        actualizarTemperatura();

        registrarEvento(
            "Temperatura aumentada a " + temperatura + " °C"
        );
    }
}

function actualizarTemperatura() {
    document.getElementById("temperatura").textContent = temperatura;
    document.getElementById("temperaturaVisual").textContent = temperatura;
    document.getElementById("sensorTemperatura").textContent = temperatura;

    actualizarHumedad();
    revisarAlertas();
}


// =============================
// PUERTA
// =============================

let puertaAbierta = false;

function cambiarPuerta() {
    if (!conectado) {
        mostrarAlertaConexion();
        return;
    }

    puertaAbierta = !puertaAbierta;

    const estadoPuerta = document.getElementById("estadoPuerta");
    const sensorPuerta = document.getElementById("sensorPuerta");
    const mensajeVisual = document.getElementById("mensajeVisual");
    const refrigerador = document.querySelector(".refrigerador");

    if (puertaAbierta) {
        estadoPuerta.textContent = "Abierta";
        sensorPuerta.textContent = "Abierta";
        mensajeVisual.textContent = "🚪 Refrigerador abierto";

        refrigerador.classList.add("abierto");

        registrarEvento("Puerta abierta");
    } else {
        estadoPuerta.textContent = "Cerrada";
        sensorPuerta.textContent = "Cerrada";
        mensajeVisual.textContent = "🔒 Refrigerador cerrado";

        refrigerador.classList.remove("abierto");

        registrarEvento("Puerta cerrada");
    }

    revisarAlertas();
}


// =============================
// LUZ
// =============================

let luzEncendida = false;

function cambiarLuz() {
    if (!conectado) {
        mostrarAlertaConexion();
        return;
    }

    luzEncendida = !luzEncendida;

    const estadoLuz = document.getElementById("estadoLuz");

    if (luzEncendida) {
        estadoLuz.textContent = "Encendida";
        registrarEvento("Luz interior encendida");
    } else {
        estadoLuz.textContent = "Apagada";
        registrarEvento("Luz interior apagada");
    }
}


// =============================
// PRODUCTOS Y LOCALSTORAGE
// =============================

let productos =
    JSON.parse(localStorage.getItem("productos")) || [];

function agregarProducto() {
    const input = document.getElementById("producto");
    const nombreProducto = input.value.trim();

    if (nombreProducto === "") {
        alert("Ingrese el nombre de un producto.");
        return;
    }

    productos.push(nombreProducto);

    guardarProductos();
    mostrarProductos();

    registrarEvento(
        "Producto agregado: " + nombreProducto
    );

    input.value = "";
}

function guardarProductos() {
    localStorage.setItem(
        "productos",
        JSON.stringify(productos)
    );
}

function mostrarProductos() {
    const lista =
        document.getElementById("listaProductos");

    const interior =
        document.getElementById("interiorProductos");

    lista.innerHTML = "";
    interior.innerHTML = "";

    productos.forEach(function(nombreProducto, indice) {

        // Producto en la lista
        const producto =
            document.createElement("li");

        const nombre =
            document.createElement("span");

        nombre.textContent = nombreProducto;

        // Botón eliminar
        const botonEliminar =
            document.createElement("button");

        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn-eliminar");

        botonEliminar.onclick = function() {
            eliminarProducto(indice);
        };

        producto.appendChild(nombre);
        producto.appendChild(botonEliminar);

        lista.appendChild(producto);


        // Producto dentro del refrigerador
        const productoInterior =
            document.createElement("div");

        productoInterior.classList.add(
            "producto-interior"
        );

        productoInterior.textContent =
            obtenerEmoji(nombreProducto) +
            " " +
            nombreProducto;

        interior.appendChild(productoInterior);
    });
}

function eliminarProducto(indice) {
    const nombreProducto = productos[indice];

    productos.splice(indice, 1);

    guardarProductos();
    mostrarProductos();

    registrarEvento(
        "Producto eliminado: " + nombreProducto
    );
}


// =============================
// EMOJIS DE PRODUCTOS
// =============================

function obtenerEmoji(nombre) {
    const producto = nombre.toLowerCase();

    if (producto.includes("leche")) return "🥛";
    if (producto.includes("manzana")) return "🍎";
    if (producto.includes("queso")) return "🧀";
    if (producto.includes("huevo")) return "🥚";
    if (producto.includes("zanahoria")) return "🥕";
    if (producto.includes("uva")) return "🍇";

    if (
        producto.includes("brocoli") ||
        producto.includes("brócoli")
    ) {
        return "🥦";
    }

    if (producto.includes("jugo")) return "🧃";
    if (producto.includes("bebida")) return "🥤";
    if (producto.includes("carne")) return "🥩";
    if (producto.includes("pollo")) return "🍗";
    if (producto.includes("pescado")) return "🐟";

    return "📦";
}


// =============================
// SISTEMA DE ALERTAS
// =============================

function revisarAlertas() {
    const alerta =
        document.getElementById("alerta");

    if (puertaAbierta) {
        alerta.textContent =
            "⚠️ Alerta: la puerta está abierta.";

        alerta.style.background = "#ffcdd2";
    }
    else if (temperatura > 8) {
        alerta.textContent =
            "🔥 Alerta: temperatura demasiado alta.";

        alerta.style.background = "#ffcdd2";
    }
    else if (temperatura < 0) {
        alerta.textContent =
            "❄️ Alerta: temperatura demasiado baja.";

        alerta.style.background = "#fff3cd";
    }
    else {
        alerta.textContent =
            "✅ Sistema funcionando correctamente.";

        alerta.style.background = "#e8f5e9";
    }
}


// =============================
// SENSOR DE HUMEDAD
// =============================

function actualizarHumedad() {
    let humedad = 65;

    if (temperatura > 8) {
        humedad = 75;
    }
    else if (temperatura < 0) {
        humedad = 55;
    }

    document.getElementById(
        "sensorHumedad"
    ).textContent = humedad;
}


// =============================
// CONEXIÓN IOT
// =============================

let conectado = true;

function mostrarAlertaConexion() {
    const alerta =
        document.getElementById("alerta");

    alerta.textContent =
        "📡 Sin conexión IoT: control remoto no disponible.";

    alerta.style.background = "#fff3cd";
}

function cambiarConexion() {
    conectado = !conectado;

    const estadoConexion =
        document.getElementById("estadoConexion");

    const boton =
        document.getElementById("btnConexion");

    const sensorTemperatura =
        document.getElementById("sensorTemperatura");

    const sensorHumedad =
        document.getElementById("sensorHumedad");

    const sensorPuerta =
        document.getElementById("sensorPuerta");

    if (conectado) {
        estadoConexion.textContent = "● Conectado";

        estadoConexion.classList.remove(
            "desconectado"
        );

        estadoConexion.classList.add(
            "conectado"
        );

        boton.textContent = "Desconectar";

        sensorTemperatura.textContent =
            temperatura;

        actualizarHumedad();

        sensorPuerta.textContent =
            puertaAbierta ? "Abierta" : "Cerrada";

        revisarAlertas();

        registrarEvento(
            "Conexión IoT establecida"
        );
    }
    else {
        estadoConexion.textContent =
            "● Desconectado";

        estadoConexion.classList.remove(
            "conectado"
        );

        estadoConexion.classList.add(
            "desconectado"
        );

        boton.textContent = "Conectar";

        sensorTemperatura.textContent = "--";
        sensorHumedad.textContent = "--";
        sensorPuerta.textContent = "Sin conexión";

        mostrarAlertaConexion();

        registrarEvento(
            "Conexión IoT perdida"
        );
    }
}


// =============================
// HISTORIAL DE EVENTOS
// =============================

let historial =
    JSON.parse(localStorage.getItem("historial")) || [];

function registrarEvento(mensaje) {
    const ahora = new Date();

    const hora =
        ahora.toLocaleTimeString("es-CL", {
            hour: "2-digit",
            minute: "2-digit"
        });

    const evento = {
        hora: hora,
        mensaje: mensaje
    };

    historial.unshift(evento);

    // Máximo 30 eventos
    if (historial.length > 30) {
        historial.pop();
    }

    localStorage.setItem(
        "historial",
        JSON.stringify(historial)
    );

    mostrarHistorial();
}

function mostrarHistorial() {
    const lista =
        document.getElementById("historialEventos");

    lista.innerHTML = "";

    historial.forEach(function(evento) {
        const elemento =
            document.createElement("li");

        elemento.textContent =
            evento.hora +
            " - " +
            evento.mensaje;

        lista.appendChild(elemento);
    });
}

function limpiarHistorial() {
    historial = [];

    localStorage.removeItem("historial");

    mostrarHistorial();
}


// =============================
// CARGAR DATOS AL INICIAR
// =============================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        mostrarProductos();
        actualizarTemperatura();
        mostrarHistorial();

        if (historial.length === 0) {
            registrarEvento("Sistema iniciado");
        }
    }
);