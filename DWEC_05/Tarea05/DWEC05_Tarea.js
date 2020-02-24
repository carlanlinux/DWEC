/* Cuando el documento esté completamente cargado se hará ua llamada a la función inicializar(). De esta forma,
nos aseguramos que todos los objetos estén disponibles para trabjar en las asignaciones de los eventos. */


window.onload = inicializar();


//Inicializamos la validación y primero comprobamos si la cookie tiene algún valor en contador.
function inicializar() {
    //Hacemos que se cargue la función de cambiar el texto a mayus que se tiene que hacer en todos los casos.
    aMayus();
    //Si existe el valor en la cookie entonces llamamos al evento que se va a encargar de la validación
    if (document.cookie[contador] != null) {
        document.getElementById("enviar").addEventListener('click', validar, false);

        //Si no existe el contador en la cookie lo creamos y lo igualamos a 0
    } else {
        crearCookie();
        document.getElementById("enviar").addEventListener("click", validar, false);
    }

}


function validar(evento) {
    /*
        En la variable que pongamos aquí gestionaremos el evento por defecto asociado al botón de "enviar"
        (type=submit) que en este caso lo que hace por defecto es enviar un formulario.
    */
    if (validarTexto(this) && validadEdad() && validadNIF() && validarProvincia() && validarFecha() && validarHora()
        && validarTelefono() && validarEmail()) {
        return true;

    } else {
        return false;
        evento.preventDefault();
        intentosCookie();
    }

}


//Función para crear una coockie con inicializando el contador a 0
function crearCookie() {
    document.cookie = "contador=0";
}

//Cuando se da al botón enviar, si ha habido algún error, ponemos en el div el número de intentos.
function intentosCookie() {
    let intentos = parseInt(document.cookie[contador]);
    document.cookie = "contador=" + intentos++;
    document.getElementById("intentos").innerHTML = "Intentos de envío del formulario:" + intentos + 1;

}

//Función para poner el texto en mayúsculas cuando se quite el foco
function aMayus() {
    //Usamos una función anónima para hacer el cambio de valor
    document.getElementById("nombre").addEventListener("blur", function () {
        document.getElementById("nombre").value = document.getElementById("nombre").value.toUpperCase();
    }, false);

    document.getElementById("apellido").addEventListener("blur", function () {
        document.getElementById("apellido").value = document.getElementById("apellido").value.toUpperCase();
    }, false)

}

function validarNombre() {
    if (document.getElementById("nombre").value === "" || document.getElementById("apellido").value === "") {

    }

}

function validarTexto(objeto) {

}

function validadEdad() {

}

function validadNIF() {

}

function validarEmail() {

}

function validarProvincia() {

}

function validarFecha() {

}

function validarTelefono() {

}

function validarHora() {

}

