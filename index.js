let stompCliente = null;

const onConnectSocket = () => {
    stompCliente.subscribe('/tema/mensajes', (mensaje) => {
        mostrarMensaje(mensaje.body);
    });
};

const onWebSocketClose = () => {
    if (stompCliente !== null) {
        stompCliente.deactivate();
    }
};

const conectarWS = () => {
    onWebSocketClose();
    stompCliente = new StompJs.Client({
        //webSocketFactory: () => new WebSocket('ws://localhost:8080/websocket')
        webSocketFactory: () => new WebSocket('wss://chat-80hl.onrender.com/websocket')
    });
    stompCliente.onConnect = onConnectSocket;
    stompCliente.onWebSocketClose = onWebSocketClose;
    stompCliente.activate();
};

const enviarMensaje = () => {
    let txtNombre = document.getElementById('nombre');
    let txtMensaje = document.getElementById('mensaje');

    stompCliente.publish({
        destination: '/app/envio',
        body: JSON.stringify({
            nombre: txtNombre.value,
            contenido: txtMensaje.value
        })
    });
    txtNombre.value = '';
    txtMensaje.value = '';
};

const mostrarMensaje = (mensaje) => {
    const body = JSON.parse(mensaje);
    const ULMensajes = document.getElementById('ULMensajes');

    const mensajeLI = document.createElement('li');
    mensajeLI.classList.add('list-group-item');
    mensajeLI.innerHTML = `<strong>${body.nombre}</strong>: ${body.contenido}`;
    ULMensajes.appendChild(mensajeLI);
};

document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('btnEnviar');
    btnEnviar.addEventListener('click', (e) => {
        e.preventDefault();
        enviarMensaje();
    });
    conectarWS();
});