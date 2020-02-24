//Crear la cookie a 0, se debe activar cuando se cargue el documento (onLoad)
function crearCookie() {
    document.cookie = "contador=0";
}

//Se debe activar cuando se da al botón enviar
function intentosCookie() {
    let intentos = parseInt(document.cookie[contador]);
    document.cookie = "contador=" + intentos + 1;
    document.getElementById("intentos").innerHTML = "Intentos de envío del formulario:" + intentos + 1;

}

function aMayus() {
    document.getElementById("nombre").toString().toUpperCase();
    document.getElementById("apellido").toString().toUpperCase();

}
